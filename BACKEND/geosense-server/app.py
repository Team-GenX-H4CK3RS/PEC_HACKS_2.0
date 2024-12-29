from uuid import uuid4
from flask import Flask, request, Response, jsonify
from flask_cors import CORS
# import ngoweb_handler as ngoweb
import googlemaps_handler as gmaps_handler
import ngo_handler
from med_chatbot.chatbot import ChatBot
from dotenv import load_dotenv
import speech2text as s2t

load_dotenv()

chatbot = ChatBot()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/gmaps/nearbyplaces')
def api_nearbyplaces():
    location = request.args.get('location')
    place = request.args.get('place')
    return jsonify(gmaps_handler.get_nearby_places(location, place))


@app.route('/gmaps/nearbyplaces/details')
def api_nearbyplacedetails():
    place_id = request.args.get('place_id')
    return jsonify(gmaps_handler.get_nearby_place_details(place_id))


@app.route('/gmaps/routes')
def api_distancematrix():
    origin = request.args.get('origin')
    destination = request.args.get('dest')
    return jsonify(gmaps_handler.get_distance_matrix(origin, destination))


@app.route('/ngos/states')
def api_get_states():
    return jsonify(ngo_handler.get_states())


@app.route('/ngos/states/<state_value>/districts')
def api_get_state_districts(state_value):
    return jsonify(ngo_handler.get_districts(state_value))


@app.route('/ngos/sectors')
def api_get_sectors():
    return jsonify(ngo_handler.get_sectors())


@app.route('/ngos/search')
def api_search():
    state = request.args.get('state')
    district = request.args.get('district')
    sectors = request.args.get('sectors')
    return jsonify(ngo_handler.get_ngos(state, district, None if not sectors else ((sectors,) if ',' not in sectors else sectors.split(','))))


@app.route('/medchat/new')
def api_medchat_new():
    sid = uuid4().hex
    chatbot.create_chat(sid)
    return jsonify({'sessionId': sid})


@app.route('/medchat/send', methods=["POST"])
def api_medchat_send():
    sid = request.json.get('sessionId')
    msg = request.json.get('msg')
    return jsonify({'result': chatbot.send(sid, msg)})


@app.route('/medchat/close')
def api_medchat_close():
    sid = request.json.get('sessionId')
    chatbot.remove_chat(sid)
    return Response(status=200)


@app.route('/speechttext', methods=['POST'])
def get_speechttext():
    audio = request.json.get('audio')
    if audio is None:
        return Response(status=400)
    text_res = s2t.speech_to_text_translate(audio)
    if 'error' in text_res:
        return Response(status=400)
    return jsonify({'text': text_res})


if __name__ == '__main__':
    try:
        app.run(host="0.0.0.0", debug=True)
    except KeyboardInterrupt:
        print("Ending")
