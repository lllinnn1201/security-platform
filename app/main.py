import shutil
import subprocess
import tempfile
import zipfile
import uuid
import sys
import os

from pathlib import Path

from fastapi import FastAPI, File, UploadFile, Request, Form
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.templating import Jinja2Templates
from app.osv_runner import run_osv_scan, parse_osv_summary
MAX_ZIP_BYTES = 50 * 1024 * 1024  # 50MB

app = FastAPI()
templates = Jinja2Templates(directory="app/templates")

LOCK_NAMES = [
    "poetry.lock", "Pipfile.lock", "requirements.txt", "requirements.lock",
    "package-lock.json", "yarn.lock",
    "Cargo.lock", "Gemfile.lock", "composer.lock", "go.sum"
]


def resolve_lock_generate_path() -> str:
    """
    Docker 內通常是 /app/validation/lock_generate.py
    本機開發通常是 <project_root>/validation/lock_generate.py
    """
    candidates = [
        Path("/app/validation/lock_generate.py"),               # Docker
        Path(__file__).resolve().parents[1] / "validation" / "lock_generate.py",  # 本機：sbom-web-tool/validation/...
    ]
    for p in candidates:
        if p.exists():
            return str(p)
    raise RuntimeError("找不到 lock_generate.py，請確認 validation/ 資料夾存在且包含 lock_generate.py")

def run_cmd(cmd: list[str], cwd: str, env: dict | None = None) -> subprocess.CompletedProcess:
    p = subprocess.run(
        cmd,
        cwd=cwd,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        env=env,
    )
    if p.returncode != 0:
        raise RuntimeError(
            f"Command failed: {' '.join(cmd)}\n\nSTDOUT:\n{p.stdout}\n\nSTDERR:\n{p.stderr}"
        )
    return p


def count_grype_matches(grype_json_path: Path) -> int:
    import json
    try:
        with grype_json_path.open("r", encoding="utf-8") as f:
            d = json.load(f)
    except UnicodeDecodeError:
        with grype_json_path.open("r", encoding="utf-16") as f:
            d = json.load(f)
    return len(d.get("matches", []))

def count_trivy_vulns(trivy_json_path: Path) -> int:
    import json
    with trivy_json_path.open("r", encoding="utf-8") as f:
        d = json.load(f)
    total = 0
    for r in (d.get("Results") or []):
        total += len(r.get("Vulnerabilities") or [])
    return total

@app.get("/", response_class=HTMLResponse)
def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/scan", response_class=HTMLResponse)
async def scan(request: Request, file: UploadFile = File(...), gen_lock: str | None = Form(None)):
    enable_lock = (gen_lock is not None)
    env = os.environ.copy()
    env["PYTHONUTF8"] = "1"
    env["PYTHONIOENCODING"] = "utf-8"
    env["RICH_NO_COLOR"] = "1"
    env["RICH_FORCE_TERMINAL"] = "0"
    env["TERM"] = "dumb"
    env["RICH_DISABLE"] = "1"
    env["NO_COLOR"] = "1"

    # 0) 建立 scan_id 與 output 目錄（用來提供下載）
    scan_id = str(uuid.uuid4())
    output_dir = Path("output") / scan_id
    output_dir.mkdir(parents=True, exist_ok=True)

    # 1) 基本檢查
    if not file.filename.lower().endswith(".zip"):
        return templates.TemplateResponse("result.html", {
            "request": request,
            "error": "只接受 .zip 檔案",
        })

    content = await file.read()
    if len(content) > MAX_ZIP_BYTES:
        return templates.TemplateResponse("result.html", {
            "request": request,
            "error": f"檔案太大（上限 {MAX_ZIP_BYTES//1024//1024}MB）",
        })

    workdir = Path(tempfile.mkdtemp(prefix="sbomscan_"))
    syft_sbom = None
    trivy_sbom = None
    syft_vuln = None
    trivy_vuln = None
    osv_vuln = None
    osv_summary = None

    try:
        zip_path = workdir / "upload.zip"
        zip_path.write_bytes(content)

        # 2) 解壓縮（避免 Zip Slip）
        extract_dir = workdir / "repo"
        extract_dir.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(zip_path, "r") as z:
            for member in z.infolist():
                member_path = Path(member.filename)
                if member_path.is_absolute() or ".." in member_path.parts:
                    raise RuntimeError("zip 內含不安全路徑（疑似 path traversal）")
            z.extractall(extract_dir)

        # zip 可能多包一層資料夾
        entries = list(extract_dir.iterdir())
        target_root = entries[0] if (len(entries) == 1 and entries[0].is_dir()) else extract_dir

        # [Stage 1] Lock file generation（論文重現模式）
        if enable_lock:
            dataset_root = workdir / "dataset"
            repo_dir = dataset_root / "python" / "uploaded" / "uploaded_project"
            repo_dir.parent.mkdir(parents=True, exist_ok=True)

            shutil.copytree(target_root, repo_dir, dirs_exist_ok=True)

            lock_script = resolve_lock_generate_path()

            # ✅ 正確：這裡只負責產生 lock files，不要做 grype
            run_cmd(
                [
                    sys.executable, lock_script,
                    "--language", "python",
                    "--path", str(dataset_root),
                ],
                cwd=str(dataset_root),
                env=env
            )


            # 後續掃描改用 repo_dir（這裡才會有 poetry.lock / 其他 lock）
            target_root = repo_dir



        # 偵測 lock files
        generated_locks = []
        for name in LOCK_NAMES:
            for p in Path(target_root).rglob(name):
                generated_locks.append(str(p.relative_to(target_root)))


        # 3) 產 SBOM
        syft_sbom = workdir / "syft-sbom.json"
        trivy_sbom = workdir / "trivy-sbom.json"

        run_cmd(["syft", "dir:.", "-o", f"cyclonedx-json={syft_sbom.name}"], cwd=str(target_root))
        shutil.move(str(Path(target_root) / syft_sbom.name), syft_sbom)

        run_cmd(["trivy", "fs", "--format", "cyclonedx", "--output", str(trivy_sbom), "."], cwd=str(target_root))

        # 4) 漏洞掃描
        syft_vuln = workdir / "syft-vuln.json"
        trivy_vuln = workdir / "trivy-vuln.json"
        osv_vuln = workdir / "osv-vuln.json"

        # Grype：掃 Syft SBOM
        p = subprocess.run(
            ["grype", f"sbom:{syft_sbom}", "-o", "json"],
            cwd=str(target_root),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace"
        )
        if p.returncode != 0:
            raise RuntimeError(f"grype failed\n\nSTDOUT:\n{p.stdout}\n\nSTDERR:\n{p.stderr}")
        syft_vuln.write_text(p.stdout, encoding="utf-8")

        # Trivy：掃檔案系統漏洞
        run_cmd(
            ["trivy", "fs", "--scanners", "vuln", "--format", "json", "--output", str(trivy_vuln), "."],
            cwd=str(target_root)
        )

        # OSV-Scanner：掃 source / requirements / lockfile
        osv_result = run_osv_scan(str(target_root), str(osv_vuln))
        osv_summary = parse_osv_summary(str(osv_vuln))

        # 5) 統計
        grype_matches = count_grype_matches(syft_vuln)
        trivy_total = count_trivy_vulns(trivy_vuln)
        osv_total = osv_summary["vulnerability_count"] if osv_summary else 0
        osv_package_count = osv_summary["package_count"] if osv_summary else 0

        # 6) 打包結果供下載（存到 output）
        bundle = output_dir / "reports.zip"
        with zipfile.ZipFile(bundle, "w", compression=zipfile.ZIP_DEFLATED) as z:
            z.write(syft_sbom, arcname="syft-sbom.json")
            z.write(trivy_sbom, arcname="trivy-sbom.json")
            z.write(syft_vuln, arcname="syft-vuln.json")
            z.write(trivy_vuln, arcname="trivy-vuln.json")
            if osv_vuln and osv_vuln.exists():
                z.write(osv_vuln, arcname="osv-vuln.json")

        return templates.TemplateResponse("result.html", {
            "request": request,
            "error": None,
            "scan_id": scan_id,
            "enable_lock": enable_lock,
            "generated_locks": generated_locks,
            "grype_matches": grype_matches,
            "trivy_vulns": trivy_total,
            "osv_vulns": osv_total,
            "osv_packages": osv_package_count,
            "osv_summary": osv_summary,
            "osv_success": osv_result["success"],
            "osv_returncode": osv_result["returncode"],
            "osv_stderr": osv_result["stderr"],
        })

    except Exception as e:
        return templates.TemplateResponse("result.html", {
            "request": request,
            "error": str(e),
        })

@app.get("/download")
def download(scan_id: str):
    bundle = Path("output") / scan_id / "reports.zip"
    if not bundle.exists():
        return {"error": "找不到報告檔案（可能已被清理）"}
    return FileResponse(path=bundle, filename="reports.zip", media_type="application/zip")
