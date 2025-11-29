# **FANGO**

*A just-in-time language companion for real-world travel.*

![Python](https://img.shields.io/badge/Python-3.12-blue.svg)
![Django](https://img.shields.io/badge/Django-5.2-darkgreen.svg)
![React](https://img.shields.io/badge/React-TypeScript-3178C6.svg)
![OpenAI](https://img.shields.io/badge/OpenAI-Vision_API-black.svg)

---

## 📘 **Table of Contents**

* [Overview](#-overview)
* [Features](#-features)
* [Tech Stack](#-tech-stack)
* [Architecture](#-architecture)
* [Installation](#-installation)
* [Environment Variables](#-environment-variables)
* [Project Structure](#-project-structure)
* [API Workflow](#-api-workflow)
* [Authentication](#-authentication)
* [Testing](#-testing)
* [Roadmap](#-roadmap)
* [Contributors](#-contributors)
* [License](#-license)

---

# 🌍 **Overview**

**FANGO** is a *just-in-time language companion* built for travellers.
Snap a photo of anything—street food, a monument, a café menu—and FANGO instantly:

* Recognizes the object
* Translates it into your chosen language
* Pronounces it for you
* Provides two safe, usable phrases
* Saves everything for later review

Unlike lesson-based apps, **FANGO starts with the real world in front of you.**

---

# ✨ **Features**

### 🔍 Instant Photo-to-Translation

* Upload or take a photo
* AI-powered object detection
* Real-time translation
* Auto-generated pronunciation
* Auto-generated travel-safe short phrases

### 🧳 Travel-Focused

* Designed for situations when you need answers *now*
* Helpful for food, signs, labels, products, monuments, etc.

### 🗂️ Smart History Tracking

* Review previous translations
* Learn vocabulary naturally
* Pagination and filtering

### 👤 Accounts & Sync

* Create/manage user account
* Data synced across devices
* JWT authentication

### 🎓 Micro-Learning

* Learn during travel moments
* No long lessons
* Safe, consistent phrasing

---

# 🧰 **Tech Stack**

### **Backend**

* Python 3.12
* Django 5.2
* Django REST Framework
* PostgreSQL
* Redis
* JWT Auth (SimpleJWT)
* Gunicorn
* Pillow (image processing)
* OpenAI Vision + GPT translation

### **Frontend**

* React
* TypeScript
* HTML / CSS
* Axios
* Vite

### **AI**

* OpenAI Vision API (Object detection from image)
* GPT for translations, pronunciation, phrase generation

---

# 🏗️ **Architecture**

```
Frontend (React/TS)
      ↓ API calls
Backend (Django REST Framework)
      ↓
OpenAI Vision API → Detect object
      ↓
GPT → Translate + Pronounce + Generate phrases
      ↓
PostgreSQL (store history, user data)
```

---

# ⚙️ **Installation**

# **Backend Setup**
Ensure docker is installed.
```bash
git pull
```
Copy .env.example contents to local .env and fill in respective values.

Change directory to project root:
```bash
cd ../group5_softwareengineering/
```

## **First time running:**
```bash
docker compose up --build
```

Remember to makemigrations if schema changed with:
```bash
docker compose run django-web python manage.py makemigrations

docker compose run django-web python manage.py migrate
```

## **Starting container after first time:**

Start services in `.docker-compose.yml` in `-d` detached mode, which runs containers in background

```bash
docker compose up -d
```

If successful, you should see the container, `group5_softwareengineering` in Docker.

try at `localhost:8000/api/persons`

---

## **Inserting mock data:**

Run Django shell:
```bash
docker compose run -it django-web python manage.py shell
```

### **Run seed script:**
Note that these scripts are normally for fresh databases. There are a few options to seed:

1. Seed row
```bash
exec(open("fango/insert_mock_data.py").read())
```

2. Seed multiple rows
```bash
exec(open("fango/insert_mock_languages.py").read())
exec(open("fango/insert_mock_data2.py").read())
```

3. Seed edge case data
```bash
exec(open("fango/insert_test_data.py").read())
run_edge_case_seeding()
```

## **Confirm data insert was successful:**

### **Continuing from inside Django shell**

1. Import models (it should have automatically imported anyway)
from fango.models 
```bash 
import AppUser, Word, < other table you want to check >
```

2. Retrieve all rows from a table in the db, in this case it's AppUser
```bash
AppUser.objects.all()
```

3. When you're finished:
```bash
exit()
```

### **From Postgres shell**
```bash
docker compose exec db psql -U < DATABASE_USERNAME from .env > -d < DATABASE_NAME from .env >
```

1. List relations
`\dt`

2. Take note of schema names, they should be something like `fango_appuser`, `fango_quiz`, etc.

3. You can look at the schema with:
`\d fango_appuser`
*press q when you're done*

4. Fetch all rows from a table, I'm checking fango_appuser in this example: `SELECT * FROM fango_appuser;`
*press q when you're done*

5. When you're finished:
`exit`

---

## **Testing Redis Sessioning and Rate Limiting:**
```bash
docker exec -it fango-redis redis-cli
```

Show all stored keys
``` bash
KEYS *
```

Show all values of a session key, e.g. user:<uid>:session
```bash
HGETALL user:<uid>:session
```
We use HGETALL because this key is a hash, which is a dictionary stored in Redis 

To show number of requests made in the current period of a rate limit key, e.g. `ratelimit:<ip/user>`:...
```bash
GET ratelimit:<ip/user>:...
```

Show the seconds until a key's expiration
```bash
TTL <some key>
```

---

### **Disable rate limiting:**
Comment out the `RateLimitMiddleware` under `settings.py`

### **Restarting container to load new changes:**
```bash
docker restart <container name>
```

### **To remove containers and volumes:**
```bash
docker compose down -v
```


# **Frontend Setup**

```bash
### For frontend updates
rm -rf node_modules package-lock.json pnpm-lock.yaml yarn.lock
npm install
npm run dev
```

---

# 🔧 **Environment Variables**

## **Backend (.env)**

```
DJANGO_SECRET_KEY=
DEBUG=
DJANGO_LOGLEVEL=
DJANGO_ALLOWED_HOSTS=

DATABASE_ENGINE=
DATABASE_NAME=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_HOST=
DATABASE_PORT=
DATABASE_URL=

TOKEN_SERCRET=
```

## **Frontend (.env)**

```
VITE_SERVER_URL=
VITE_REDIRECT_URL=
```

---

# 🗂️ **Project Structure**

```
GROUP5_SOFTWAREENGINEERING/
├── backend/
│   ├── fango/
│   │   ├── middleware/
│   │   │   ├── JWTRedisMiddleware.py
│   │   │   └── RateLimitMiddleware.py
│   │   │
│   │   ├── migrations/
│   │   │   ├── 0001_initial.py
│   │   │   ├── 0002_appuser_country_appuser_default_lang_id_and_more.py
│   │   │   └── 0003_appuser_difficulty.py
│   │   │
│   │   ├── services/
│   │   │   ├── mock_response.json
│   │   │   └── openai_service.py
│   │   │
│   │   ├── tests/
│   │   │   ├── test_utils.py
│   │   │   └── test_views.py
│   │   │
│   │   ├── image_handling/
│   │   │   └── (image helper modules)
│   │   │
│   │   ├── media/
│   │   │   └── (uploaded images)
│   │   │
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── api_urls.py
│   │   ├── apps.py
│   │   ├── asgi.py
│   │   ├── insert_mock_data.py
│   │   ├── insert_mock_data2.py
│   │   ├── insert_mock_languages.py
│   │   ├── insert_test_data.py
│   │   ├── managers.py
│   │   ├── models.py
│   │   ├── redis_client.py
│   │   ├── serializers.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── utils.py
│   │   ├── views.py
│   │   └── wsgi.py
│   │
│   ├── Dockerfile
│   ├── manage.py
│   └── requirements.txt
│
│
├── frontend/
│   ├── data/
│   │   ├── countries.json
│   │   └── languages.json
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── pingu_signup.jpg
│   │   │   └── pingu1.jpg
│   │   │
│   │   ├── components/
│   │   │   ├── animation/
│   │   │   │   └── SpringMotionLayout.tsx
│   │   │   │
│   │   │   ├── card/
│   │   │   │   ├── CardMenu.tsx
│   │   │   │   ├── Cards.tsx
│   │   │   │   ├── GalleryPage.tsx
│   │   │   │   └── ImageFlipCard.tsx
│   │   │   │
│   │   │   ├── checkbox/
│   │   │   │   ├── MultiCheckbox.tsx
│   │   │   │   └── SingleCheckbox.tsx
│   │   │   │
│   │   │   ├── goals/
│   │   │   │   └── options.tsx
│   │   │   │
│   │   │   ├── nav/
│   │   │   │   ├── AppLayout.tsx
│   │   │   │   └── BottomNav.tsx
│   │   │   │
│   │   │   └── utils/
│   │   │       ├── AuthRoute.tsx
│   │   │       ├── CountrySuggest.ts
│   │   │       ├── LanguageSuggest.ts
│   │   │       ├── PasswordInputStep.tsx
│   │   │       ├── SuggestInputStep.tsx
│   │   │       ├── TextInputStep.tsx
│   │   │       ├── JsonPost.tsx
│   │   │       └── Logout.tsx
│   │
│   │   ├── pages/
│   │   │   ├── quickguide/
│   │   │   │   └── QuickGuide.tsx
│   │   │   │
│   │   │   ├── quiz/
│   │   │   │   ├── DailyQuizDefault.tsx
│   │   │   │   ├── DailyQuizResult.tsx
│   │   │   │   └── FavWords.tsx
│   │   │   │
│   │   │   ├── signup/
│   │   │   │   ├── EmailStep.tsx
│   │   │   │   ├── NameStep.tsx
│   │   │   │   ├── PasswordStep.tsx
│   │   │   │   ├── SetUpTargetLan.tsx
│   │   │   │   ├── SignUp.tsx
│   │   │   │   ├── SignUpAllSet.tsx
│   │   │   │   ├── SignupContext.tsx
│   │   │   │   ├── SignUpDifficulty.tsx
│   │   │   │   ├── SignUpGoal.tsx
│   │   │   │   └── Types.tsx
│   │   │   │
│   │   │   ├── status/
│   │   │   │   ├── 404.tsx
│   │   │   │   └── Loading.tsx
│   │   │   │
│   │   │   ├── translation/
│   │   │   │   ├── Camera.tsx
│   │   │   │   ├── Processing.tsx
│   │   │   │   └── Result.tsx
│   │   │   │
│   │   │   └── user/
│   │   │       ├── Login.tsx
│   │   │       ├── Userhistory.tsx
│   │   │       ├── Userhistoryitem.tsx
│   │   │       ├── Userinfo.tsx
│   │   │       └── Userlearninginfo.tsx
│   │
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
├── docker-compose.yml
└── README.md
```
---

# 🤖 **API Workflow**

1. User uploads or snaps a photo
2. Backend receives image
3. Image sent → **OpenAI Vision**
4. AI returns object description
5. Backend sends object → **GPT model** for:

   * Translation into selected language
   * Pronunciation guide
   * Two mini safety-checked phrases
6. Backend saves both the image + results in PostgreSQL
7. Frontend displays translation + history updates

---

# 🔐 **Authentication**

* JWT (access + refresh) tokens
* Login / Register endpoints
* Protected routes:

  * Upload photo
  * View history
  * Manage account

---

# 🧪 **Testing**

### Backend

```bash
python manage.py test
```

### Frontend

```bash
npm run test
```

---

# 🧭 **Roadmap**

* [ ] Offline translation mode
* [ ] Speech recognition (ask questions verbally)
* [ ] AR translation overlay
* [ ] Phrase-of-the-day widget
* [ ] Multi-language phrase packs
* [ ] Dark mode
* [ ] Daily Quiz

---

# 👥 **Contributors**


* Joe Lin A01079256
* Louise Li A01377263
* Blaise Klein A01300754
* Reece Melnick A01349668
* Inez Yoon A01066348

