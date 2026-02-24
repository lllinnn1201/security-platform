import json
import re
import sys

# 檔案設定
DYNAMIC_LOG = 'loaded_files.txt'
GRYPE_JSON = 'grype_result.json'

def get_dynamic_packages(log_file):
    """從 strace log 解析出真正被執行的套件名稱"""
    dynamic_pkgs = set()
    try:
        with open(log_file, 'r') as f:
            lines = f.readlines()
        
        for line in lines:
            if " = -1" in line: continue # 忽略失敗的
            
            # 抓取路徑
            match = re.search(r'"([^"]+)"', line)
            if match:
                path = match.group(1)
                # 只看 site-packages 或 dist-packages
                if "site-packages/" in path or "dist-packages/" in path:
                    try:
                        # 提取套件名
                        pkg = re.split(r'(?:site|dist)-packages/', path)[1].split('/')[0]
                        # 清洗名稱 (去除 .dist-info, .egg-info)
                        if pkg.endswith('.dist-info') or pkg.endswith('.egg-info'):
                            pkg = pkg.split('-')[0]
                        # 統一轉小寫以利比對
                        dynamic_pkgs.add(pkg.lower().replace('_', '-'))
                    except:
                        pass
        return dynamic_pkgs
    except FileNotFoundError:
        print(f"錯誤：找不到 {log_file}，請確認檔案是否存在！")
        sys.exit(1)

def main():
    print(f"[*] 正在讀取動態執行紀錄: {DYNAMIC_LOG}...")
    executed_pkgs = get_dynamic_packages(DYNAMIC_LOG)
    print(f"    -> 偵測到 {len(executed_pkgs)} 個執行中的套件 (Active Packages)")

    print(f"[*] 正在讀取漏洞掃描報告: {GRYPE_JSON}...")
    try:
        with open(GRYPE_JSON, 'r') as f:
            vuln_data = json.load(f)
    except FileNotFoundError:
        print(f"錯誤：找不到 {GRYPE_JSON}，請確認 Step 2 有執行成功！")
        sys.exit(1)

    matches = vuln_data.get('matches', [])
    total_vulns = len(matches)
    print(f"    -> 靜態掃描共發現 {total_vulns} 個漏洞")

    # 開始比對
    reachable = []
    unreachable = []

    print("\n" + "="*80)
    print(f"{'CVE ID':<20} | {'Package':<20} | {'Severity':<10} | {'Status'}")
    print("="*80)

    for match in matches:
        cve_id = match['vulnerability']['id']
        severity = match['vulnerability']['severity']
        pkg_name = match['artifact']['name'].lower().replace('_', '-') # 統一格式

        # 核心判斷：漏洞套件是否在動態清單中？
        if pkg_name in executed_pkgs:
            status = "🔴 REACHABLE (危險)"
            reachable.append((cve_id, pkg_name, severity))
            print(f"{cve_id:<20} | {pkg_name:<20} | {severity:<10} | {status}")
        else:
            status = "🟢 Unreachable (虛胖)"
            unreachable.append((cve_id, pkg_name, severity))
    
    # 計算縮減率
    reduction_rate = 0
    if total_vulns > 0:
        reduction_rate = (len(unreachable) / total_vulns) * 100

    # 最終統計報告
    print("="*80)
    print("【 🚀 最終分析報告 (Final Report) 】")
    print(f"1. 原始漏洞總數 (Static Analysis): {total_vulns}")
    print(f"2. 🔴 真實具威脅漏洞 (Reachable):   {len(reachable)}  <-- 這些才是必須馬上修的！")
    print(f"3. 🟢 虛胖/無效漏洞 (Unreachable): {len(unreachable)}  <-- 這些程式碼根本沒跑！")
    print(f"📉 攻擊面縮減率 (Debloating Rate): {reduction_rate:.1f}%")
    print("="*80)

if __name__ == "__main__":
    main()
