pipeline {
    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_USERNAME = 'your-dockerhub-username'
        DOCKERHUB_REPO = 'cinetix'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Build Frontend') {
                docker.image('docker:latest').inside {
                    dir('client/booking-app') {
                        sh "docker build -t ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}-frontend:latest -f Dockerfile.frontend ."
                    }
                }
            } 
        }
        
        stage('Build Backend') {
            steps { 
                docker.image('docker:latest').inside {
                    dir('server') {
                        sh "docker build -t ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}-backend:latest -f Dockerfile.backend ."
                    }
                }
            } 
        }

        stage('Push Images to Docker Hub') {
            steps {
                echo 'Logging in to Docker Hub and pushing images...'
                withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'
                    sh "docker push ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}-frontend:latest"
                    sh "docker push ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}-backend:latest"
                }
            }
        }

        stage('Deploy to AWS') {
            steps {
                echo 'Triggering deployment on AWS...'
                echo 'Deployment step is a placeholder for AWS CLI commands.'
            }
        }
    }
}
