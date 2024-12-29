import os
from twilio.rest import Client


class Messager:
    def __init__(self):
        self.client = Client(os.getenv('TWILIO_SID'),
                             os.getenv('TWILIO_AUTH_TOKEN'))

    def send(self, msg):
        self.client.messages.create(
            body=msg,
            from_='+17163207475',
            to='+916385642647'
        )
