pipeline {
    agent any

    stages {
        stage('取得原始碼 (Checkout)') {
            steps {
                git branch: 'main', url: 'https://github.com/lllinnn1201/security-platform.git'
            }
        }
        stage('編譯受測程式 (Build Target)') {
            steps {
                echo '🔨 正在編譯 C 語言測試程式...'
                sh '''
                echo "#include <stdio.h>\nint main() { printf(\\"Hello DevSecOps!\\\\n\\"); return 0; }" > target.c
                gcc target.c -o target
                '''
            }
        }
        stage('產出靜態 SBOM (Syft)') {
            steps {
                echo '📦 正在掃描專案並產生 SBOM...'
                sh 'syft dir:. -o json > my_sbom.json'
            }
        }
        stage('漏洞掃描 (Grype)') {
            steps {
                echo '🔎 正在比對漏洞資料庫...'
                sh 'grype sbom:my_sbom.json -o json > grype_result.json'
            }
        }
        stage('動態軌跡錄製 (Strace)') {
            steps {
                echo '🏃 執行程式並錄製系統呼叫...'
                sh 'strace -o loaded_files.txt ./target'
            }
        }
        stage('動態漏洞過濾 (Python Engine)') {
            steps {
                echo '🧠 啟動核心過濾引擎...'
                // 執行你的過濾腳本
                sh 'python3 prioritize_vuln.py || true'
            }
        }
    }
}
