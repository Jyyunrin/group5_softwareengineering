import random
from fango.models import AppUser, Language, Word, Translation, UserHistory, Quiz, QuizWord
from django.utils import timezone
from django.contrib.auth.hashers import make_password
from datetime import datetime


# NOTE: This script is meant to seed a new database.
# NOTE: This clears ALL existing data (except for Language table)
# NOTE: RUN insert_mock_languages.py FIRST
QuizWord.objects.all().delete()
Quiz.objects.all().delete()
UserHistory.objects.all().delete()
Translation.objects.all().delete()
Word.objects.all().delete()
AppUser.objects.all().delete()

languages = list(Language.objects.all())
lang_fr = Language.objects.get(code="fr")
lang_zh = Language.objects.get(code="zh")
users = [
    AppUser(email="admin@test.com", name="Admin", role="admin", password=make_password("000")),
    AppUser(email="john@test.com", name="John", default_lang_id=lang_fr, password=make_password("123")),
    AppUser(email="jane@test.com", name="Jane", country="United States of America", default_lang_id=lang_zh, password=make_password("123")),
    AppUser(email="banned@test.com", name="Hubert", status="banned", password=make_password("123"))
]
AppUser.objects.bulk_create(users)
users = list(AppUser.objects.all())

words = [
    Word(label_en="Apple", meaning="A common fruit that grows on trees"),
    Word(label_en="Lemon", meaning="A yellow citrus fruit"),
    Word(label_en="Car", meaning="A vehicle with four wheels"),
    Word(label_en="House", meaning="A building to live in"),
]
Word.objects.bulk_create(words)
words = list(Word.objects.all())

translations = []
for word in words:
    for lang in languages:
        translations.append(
            Translation(
                target_lang_id=lang,
                word_id=word,
                label_target=f"{lang.code}_{word.label_en}",
                example_target_easy=f"Easy '{word.label_en}' in {lang.lang}",
                example_en_easy=f"Easy '{word.label_en}' in English",
                example_target_med=f"Medium '{word.label_en}' in {lang.lang}",
                example_en_med=f"Medium '{word.label_en}' in English",
                example_target_hard=f"Hard '{word.label_en}' in {lang.lang}",
                example_en_hard=f"Hard '{word.label_en}' in English",
                audio_name=f"{lang.code}_{word.label_en.lower()}.mp3",
                audio_path=f"/app/audio/"
            )
        )
Translation.objects.bulk_create(translations)
translations = list(Translation.objects.all())

history = []
for user in users:
    # Gets a random sample of translations. Provides up to 7 unique translations.
    sampled_translations = random.sample(translations, k=min(7, len(translations)))
    for t in sampled_translations:
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")
        history.append(
            UserHistory(
                user_id=user,
                translation_id=t,
                img_name=f"{t.word_id.label_en.lower()}_{timestamp}.png",
                img_path=f"/app/images/",
                is_favorite=random.choice([True, False])
            )
        )
UserHistory.objects.bulk_create(history)
# history = list(History.objects.all())

quizzes = []
quiz_words = []
for u in users:
    u_history = list(UserHistory.objects.filter(user_id=u))

    if u_history:
        # Provides random sample of a user's UserHistory(s). Gives up to 7 unique UserHistory.
        sampled_u_history = random.sample(u_history, k=min(7, len(u_history)))
        sampled_u_history_translation = sampled_u_history[0].translation_id
        quiz = Quiz(
                user_id=u,
                # TODO: Just sets target lang to whatever the first UserHistory translation is set to. Still unsure of quiz functionality.
                target_lang_id=sampled_u_history_translation.target_lang_id, 
                quiz_name=f"Quiz for {u.name} in {sampled_u_history_translation.target_lang_id.code}"
        )
        quizzes.append(quiz)
Quiz.objects.bulk_create(quizzes)

for quiz in quizzes:
    # Get all history for this quiz's user
    u_history = list(UserHistory.objects.filter(user_id=quiz.user_id))
    if u_history:
        sampled_u_history = random.sample(u_history, k=min(7, len(u_history)))
        for h in sampled_u_history:
            quiz_word = QuizWord(
                quiz_id=quiz,
                translation_id=h.translation_id
            )
            quiz_words.append(quiz_word)
QuizWord.objects.bulk_create(quiz_words)
