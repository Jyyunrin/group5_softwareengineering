# Setting up the database locally

Ensure docker is installed.

git pull

Copy .env.example contents to local .env and fill in respective values.

Change directory to project root:
cd ../group5_softwareengineering/

## First time running:

docker compose up --build
docker compose run django-web python manage.py migrate

## Starting container after first time:

Start services in .docker-compose.yml in -d detached mode, which runs containers in background

docker compose up -d

If successful, you should see the container, group5_softwareengineering in Docker.

try at localhost:8000/api/persons

## Inserting mock data:

Run Django shell:
docker compose run -it django-web python manage.py shell

### Run seed script:
Note that these scripts are normally for fresh databases. There are a few options to seed:
1. Seed row
exec(open("fango/insert_mock_data.py").read())
2. Seed multiple rows
exec(open("fango/insert_mock_data2.py").read())
3. Seed edge case data
exec(open("fango/insert_test_data.py").read())
run_edge_case_seeding()

## Confirm data insert was successful:

### Continuing from inside Django shell

1. Import models (it should have automatically imported anyway)
from fango.models import AppUser, Word, < other table you want to check > 
2. Retrieve all rows from a table in the db, in this case it's AppUser
AppUser.objects.all()
3. When you're finished:
exit()

### From Postgres shell

docker compose exec db psql -U < DATABASE_USERNAME from .env > -d < DATABASE_NAME from .env >

1. List relations
\dt
2. Take note of schema names, they should be something like fango_appuser, fango_quiz, etc.
3. You can look at the schema with:
\d fango_appuser
*press q when you're done*
4. Fetch all rows from a table, I'm checking fango_appuser in this example:
SELECT * FROM fango_appuser;
*press q when you're done*
5. When you're finished:
exit



To remove containers and volumes:
docker compose down -v

### For frontend updates
rm -rf node_modules package-lock.json pnpm-lock.yaml yarn.lock
npm install
npm run dev
