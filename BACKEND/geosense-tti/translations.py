from gtts import gTTS
from googletrans import Translator
import base64
from morse_code import translate_morse_code

LANGUAGES = [
    ('Bengali', 'bn'),
    ('Gujarati', 'gu'),
    ('Hindi', 'hi'),
    ('Kannada', 'kn'),
    ('Malayalam', 'ml'),
    ('Marathi', 'mr'),
    ('Nepali', 'ne'),
    ('Punjabi', 'pa'),
    ('Telugu', 'te'),
    ('Urdu', 'ur'),
    ('Arabic', 'ar'),
    ('English', 'en'),
    ('Tamil', 'ta'),
    ('French', 'fr'),
    ('German', 'de'),
    ('Italian', 'it'),
    ('Japanese', 'ja'),
    ('Korean', 'ko'),
    ('Russian', 'ru'),
    ('Spanish', 'es'),
    ('Chinese', 'zh-CN')
]

translator = Translator()
print("INFO::translations::Loaded Translator.")


def get_languages():
    return LANGUAGES


def get_translation(lang_code, text):
    if lang_code != 'mc':
        translated_text = translator.translate(text, dest=lang_code).text
        translated_audio_bytes = b''.join(
            [i for i in gTTS(translated_text, lang=lang_code).stream()])
    else:
        translated_text, translated_audio_bytes = translate_morse_code(text)
    return {'audio': base64.b64encode(translated_audio_bytes).decode('utf-8'), 'result': translated_text, 'lang': [i[0] for i in LANGUAGES if i[1] == lang_code]}
