Setting up the database locally

Ensure docker is installed.

git pull

Copy .env.example contents to local .env and fill in respective values.

Change directory to project root:
cd ../group5_softwareengineering/

Start services in .docker-compose.yml in -d detached mode, which runs containers in background:
docker compose up -d

If successful, you should see the container, group5_softwareengineering in Docker.

To completely restart with a fresh container (NOTE: this wipes all data):
docker compose down -v
docker compose up -d
