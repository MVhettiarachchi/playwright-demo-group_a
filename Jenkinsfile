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
                // Ensure devDependencies (allure-playwright) are installed
                sh 'npm install --include=dev'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh 'rm -rf allure-results'
                sh 'mkdir -p allure-results'
                // Run tests using reporters defined in playwright.config.ts
                sh 'npx playwright test || true'
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