pipeline {
    agent any

    environment {
        DJANGO_SECRET_KEY = credentials('DJANGO_SECRET_KEY')
        OPEN_API_KEY = credentials('OPENAI_API_KEY')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Create and populate .env file') {
            steps {
                sh '''
                    echo "DJANGO_SECRET_KEY=$DJANGO_SECRET_KEY" > .env
                    echo "DEBUG=True" >> .env
                    echo "DJANGO_LOGLEVEL=$DJANGO_LOGLEVEL" >> .env
                    echo "DJANGO_ALLOWED_HOSTS=$DJANGO_ALLOWED_HOSTS" >> .env
                    echo "DATABASE_ENGINE=$DATABASE_ENGINE" >> .env
                    echo "DATABASE_NAME=$DATABASE_NAME" >> .env
                    echo "DATABASE_USERNAME=$DATABASE_USERNAME" >> .env
                    echo "DATABASE_PASSWORD=$DATABASE_PASSWORD" >> .env
                    echo "DATABASE_HOST=$DATABASE_HOST" >> .env
                    echo "DATABASE_PORT=$DATABASE_PORT" >> .env
                    echo "DATABASE_URL=$DATABASE_URL" >> .env
                    echo "REDIS_HOST=$REDIS_HOST" >> .env
                    echo "REDIS_PORT=$REDIS_PORT" >> .env
                    echo "REDIS_DB=$REDIS_DB" >> .env
                    echo "OPENAI_API_KEY=$OPENAI_API_KEY" >> .env
                '''
            }
        }

        stage('Build Containers'){
            steps {
                sh "docker compose --env-file .env up -d --build"
            }
        }

        stage('Run Tests') {
            steps {
                sh 'docker compose exec -T django-web python manage.py test fango --verbosity=2'
            }
        }
    }

    post {
        always {
            sh 'docker compose down'
        }
    }
}