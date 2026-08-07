pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm ci'
                    } else {
                        bat 'npm ci'
                    }
                }
            }
        }

        stage('Run Playwright Tests') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npx playwright test'
                    } else {
                        bat 'npx playwright test'
                    }
                }
            }
        }
    }

    post {
        always {
            // Optional: Publish HTML Report if HTML Publisher plugin is installed on Linux
            catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                publishHTML(target: [
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright HTML Report'
                ])
            }
        }
    }
}