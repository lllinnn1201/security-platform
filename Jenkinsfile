pipeline {
    agent any

    stages {
        stage('取得原始碼 (Checkout)') {
            steps {
                git branch: 'main', url: 'https://github.com/lllinnn1201/security-platform.git'
            }
        }
        stage('安裝 AI 套件 (Setup Env)') {
            steps {
                echo '📦 正在建立 Python 虛擬環境與安裝 requirements.txt...'
                sh '''
                python3 -m venv venv
                . venv/bin/activate
                pip install -r requirements.txt
                '''
            }
        }
        stage('產出靜態 SBOM (Syft)') {
            steps {
                echo '🔍 掃描 Python 套件並產生 SBOM...'
                sh 'syft dir:. -o json > grype_result_temp.json'
            }
        }
        stage('靜態漏洞掃描 (Grype)') {
            steps {
                echo '🚨 正在比對漏洞庫...'
                sh 'grype sbom:grype_result_temp.json -o json > grype_result.json'
            }
        }
        stage('動態軌跡錄製 (Strace)') {
            steps {
                echo '🏃 執行 AI 模型並錄製軌跡...'
                sh '''
                . venv/bin/activate
                strace -f -o loaded_files.txt python3 run_test.py
                '''
            }
        }
        stage('動態漏洞過濾 (Python Engine)') {
            steps {
                echo '🧠 啟動核心過濾引擎...'
                sh '''
                . venv/bin/activate
                python3 prioritize_vuln.py
                '''
            }
        }
        stage('靜態開源漏洞掃描 (OSV-Scanner)') {
            steps {
                echo '🛡️ 啟動 Google OSV-Scanner...'
                sh 'osv-scanner -r . --format json > osv_report.json || true'
            }
        }
        stage('網站壓力與效能測試 (K6 & Lighthouse)') {
            steps {
                echo '🔥 啟動 K6 與 Lighthouse 測試...'
                sh 'k6 run scripts/run_k6.bat || true'
                sh 'lighthouse http://localhost:8000 --chrome-flags="--headless" --output html --output-path ./lighthouse-report.html || true'
            }
        }
        stage('資安品質門檻 (Quality Gate)') {
            steps {
                echo '🛑 正在檢查是否有高風險的 Reachable 漏洞...'
                sh 'python3 check_gate.py || true'
            }
        }
    }
}
