from flask import Flask, jsonify, Response, request
from flask_cors import cross_origin, CORS
import translations as translator

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/languages')
def get_languages():
    return jsonify(translator.get_languages())


@cross_origin
@app.route('/translate', methods=["POST"])
def get_translation():
    lang_code = request.json.get('lang_code')
    text = request.json.get('text')
    if text is None:
        return Response(status=400)
    return jsonify(translator.get_translation("en" if not lang_code else lang_code, text))


if __name__ == "__main__":
    app.run("0.0.0.0", 5500, debug=True)
