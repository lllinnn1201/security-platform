import sys
import os

print("=== 🛡️ Quality Gate (品質門檻檢測) 🛡️ ===")
if os.path.exists("FAILED_GATE.txt"):
    print("❌ [阻擋] 偵測到真實威脅 (Reachable) 的漏洞！流水線強制中斷！")
    sys.exit(1)
else:
    print("✅ [通過] 無重大真實威脅，流水線放行！")
    sys.exit(0)
