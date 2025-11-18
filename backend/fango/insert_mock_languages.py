from fango.models import Language

# NOTE: This clears ALL existing data in Languages table
Language.objects.all().delete()

languages = [
    Language(code="fr", lang="French"),
    Language(code="ko", lang="Korean"),
    Language(code="ja", lang="Japanese"),
    Language(code="zh", lang="Chinese (Simplified)"),
    Language(code="es", lang="Spanish"),
    Language(code="de", lang="German"),
    Language(code="it", lang="Italian")
]

Language.objects.bulk_create(languages)