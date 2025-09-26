Setting up the database locally

Ensure docker is installed.

git pull

Copy .env.example contents to local .env and fill in respective values.

Change directory to project root:
cd ../group5_softwareengineering/

First time running:
docker compose up --build
docker compose run django-web python manage.py migrate

Starting container after first time:
Start services in .docker-compose.yml in -d detached mode, which runs containers in background:
docker compose up -d

If successful, you should see the container, group5_softwareengineering in Docker.

try at localhost:8000/api/persons



To remove containers and volumes:
docker compose down -v
