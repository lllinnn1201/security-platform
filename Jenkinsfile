pipeline {
    agent any

    stages {
        stage('取得原始碼 (Checkout)') {
            steps {
                git branch: 'main', url: 'https://github.com/lllinnn1201/security-platform.git'
                echo '✅ 成功從 GitHub 抓下最新程式碼！'
            }
        }
        stage('初體驗 (Hello World)') {
            steps {
                echo '🚀 太神啦！這是我專屬的 DevSecOps 流水線！'
                sh 'python3 --version'
            }
        }
    }
}
