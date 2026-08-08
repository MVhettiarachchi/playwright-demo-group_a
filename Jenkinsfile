pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh 'rm -rf allure-results'
                sh 'mkdir -p allure-results'
                // Explicitly pass the allure-playwright reporter
                sh 'npx playwright test --reporter=line,allure-playwright || true'
                sh 'ls -la allure-results'
            }
        }
    }

    post {
        always {
            allure includeProperties: false, 
                   jdk: '', 
                   results: [[path: 'allure-results']]
        }
    }
}