import re

try:
    with open('loaded_files.txt', 'r') as f:
        lines = f.readlines()

    output = []
    for line in lines:
        if " = -1" not in line:
            match = re.search(r'"([^"]+)"', line)
            if match:
                path = match.group(1)
                if "site-packages/" in path or "dist-packages/" in path:
                    try:
                        pkg = re.split(r'(?:site|dist)-packages/', path)[1].split('/')[0]
                        if pkg.endswith('.dist-info') or pkg.endswith('.egg-info'):
                            pkg = pkg.split('-')[0]
                        output.append(pkg)
                    except:
                        pass

    with open('full_sequence_sbom.txt', 'w') as f:
        f.write("=== Package Execution Timeline ===\n")
        for i, pkg in enumerate(output):
            f.write(f"{i+1}. {pkg}\n")

    print(f"成功生成！共 {len(output)} 行，檔名：full_sequence_sbom.txt")

except FileNotFoundError:
    print("錯誤：找不到 loaded_files.txt，請確認檔案是否存在！")
