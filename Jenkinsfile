pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        ALLURE_RESULTS_DIR = 'allure-results'
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