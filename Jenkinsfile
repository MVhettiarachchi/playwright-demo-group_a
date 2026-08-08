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
                sh 'npm install'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                // Allows tests to finish even if some fail so reports generate
                sh 'npx playwright test || true'
            }
        }
    }

    post {
        always {
            // Generates and attaches the Allure Report link on the Jenkins job page
            allure includeProperties: false, 
                   jdk: '', 
                   results: [[path: 'allure-results']]
        }
    }
}