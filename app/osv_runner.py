import subprocess
import json
from pathlib import Path


def run_osv_scan(target_path: str, output_file: str):
    target = Path(target_path).resolve()
    output = Path(output_file).resolve()

    cmd = [
        "osv-scanner",
        "scan",
        "source",
        str(target),
        "--format",
        "json",
        "--output",
        str(output)
    ]

    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        shell=False
    )

    success = False
    if output.exists():
        try:
            with open(output, "r", encoding="utf-8") as f:
                json.load(f)
            success = True
        except Exception:
            success = False

    return {
        "success": success,
        "returncode": result.returncode,
        "stdout": result.stdout,
        "stderr": result.stderr,
        "output_file": str(output)
    }


def parse_osv_summary(json_path: str):
    path = Path(json_path)

    if not path.exists():
        return {
            "exists": False,
            "package_count": 0,
            "vulnerability_count": 0,
            "packages": []
        }

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    package_list = []
    vulnerability_count = 0

    results = data.get("results", [])
    for result in results:
        packages = result.get("packages", [])
        for pkg in packages:
            pkg_info = pkg.get("package", {})
            vulns = pkg.get("vulnerabilities", [])

            vulnerability_count += len(vulns)

            package_list.append({
                "name": pkg_info.get("name", "unknown"),
                "version": pkg_info.get("version", "unknown"),
                "ecosystem": pkg_info.get("ecosystem", "unknown"),
                "vulnerability_count": len(vulns),
                "vulnerability_ids": [v.get("id", "unknown") for v in vulns]
            })

    return {
        "exists": True,
        "package_count": len(package_list),
        "vulnerability_count": vulnerability_count,
        "packages": package_list
    }