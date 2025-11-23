from fango.models import AppUser, Language, Word, Translation, UserHistory, Quiz, QuizWord
from django.utils import timezone

# NOTE: This script is meant to seed a new database.
# NOTE: This clears ALL existing data (except for Language table)
QuizWord.objects.all().delete()
Quiz.objects.all().delete()
UserHistory.objects.all().delete()
Translation.objects.all().delete()
Word.objects.all().delete()
Language.objects.all().delete()
AppUser.objects.all().delete()

user = AppUser.objects.create(
    email="test@test.com",
    name="tester",
    password="123"
)

lang = Language.objects.create(
    code="fr",
    lang="French"
)

word = Word.objects.create(
    label_en="Apple",
    meaning="A common fruit that grows on trees"
)

translation = Translation.objects.create(
    target_lang_id=lang,
    word_id=word,
    label_target="pomme",
    example_target_easy="Une pomme rouge",
    example_en_easy="A red apple",
    example_target_med="J'ai mangé une pomme",
    example_en_med="I ate an apple",
    example_target_hard="Les pommes sont délicieuses",
    example_en_hard="Apples are delicious",
    audio_name="pomme.mp3",
    audio_path="/app/audio/pomme.mp3"
)

history = UserHistory.objects.create(
    user_id=user,
    translation_id=translation,
    img_name="apple.png",
    img_path="/app/images/apple.png",
    is_favorite=True
)

quiz = Quiz.objects.create(
    user_id=user,
    target_lang_id=lang,
    quiz_name="French Fruits Oui Oui!",
    created_at=timezone.now()
)

quiz_word = QuizWord.objects.create(
    quiz_id=quiz,
    translation_id=translation
)
