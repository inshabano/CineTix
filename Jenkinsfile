pipeline {
    agent any

    environment {
        AWS_CREDENTIALS_ID = 'aws-credentials'
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = '536697262126'
        ECR_BACKEND_REPO = 'cinetix-backend'
        ECR_FRONTEND_REPO = 'cinetix-frontend'
        ECS_CLUSTER_NAME = 'CineTix-ECS-Cluster'
        ECS_BACKEND_SERVICE = 'cinetix-backend-service'
        ECS_FRONTEND_SERVICE = 'cinetix-frontend-service'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

    stage('Build Frontend') {
        steps {
            echo 'Building frontend Docker image...'
            dir('client/booking-app') {
                sh """
                    docker build \
                    --build-arg REACT_APP_API_URL=https://api.inshabano.live \
                    -t ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_FRONTEND_REPO}:latest \
                    -f Dockerfile.frontend .
                """
            }
        }
    }


        stage('Build Backend') {
            steps {
                echo 'Building backend Docker image...'
                dir('server') {
                    sh """
                        docker build -t ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_BACKEND_REPO}:latest -f Dockerfile.backend .
                    """
                }
            }
        }

        stage('Push Images to ECR') {
            steps {
                echo 'Logging in to ECR and pushing images...'
                withAWS(credentials: AWS_CREDENTIALS_ID, region: AWS_REGION) {
                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} | \
                        docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                        docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_FRONTEND_REPO}:latest
                        docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_BACKEND_REPO}:latest
                    """
                }
            }
        }

        stage('Deploy to AWS ECS') {
            steps {
                echo 'Deploying updated services to ECS...'
                withAWS(credentials: AWS_CREDENTIALS_ID, region: AWS_REGION) {
                    sh """
                        aws ecs update-service --cluster ${ECS_CLUSTER_NAME} --service ${ECS_BACKEND_SERVICE} --force-new-deployment
                        aws ecs update-service --cluster ${ECS_CLUSTER_NAME} --service ${ECS_FRONTEND_SERVICE} --force-new-deployment
                    """
                }
            }
        }
    }
}
