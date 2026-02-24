pipeline {
    agent any

    stages {
        stage('取得原始碼 (Checkout)') {
            steps {
                git branch: 'main', url: 'https://github.com/lllinnn1201/security-platform.git'
                echo '✅ 成功從 GitHub 抓下最新程式碼！'
            }
        }
        stage('動態漏洞過濾 (Dynamic Vuln Filter)') {
            steps {
                echo '🔍 開始啟動核心引擎：比對靜態漏洞與動態軌跡...'
                sh 'python3 prioritize_vuln.py'
                echo '🎉 報告產出完成！'
            }
        }
    }
}
