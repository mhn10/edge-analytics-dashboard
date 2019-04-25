#################################################################
# This file contains a forever connection to MQTT broker        #
# waiting for messages to be published in intereseted topics.   #
# A flask server will also start here which provide end-points  #
# to access the values updated by MQTT subscriber.              #
#                                                               #
#           Written by- Sahil Sharma                            #
#################################################################


# Required Libraries
from flask import Flask, jsonify
import paho.mqtt.client as mqtt
import sys
import os
import json
import threading
import time


class MQTT:
    def __init__(self):
        self.topics = ["NodeInfo", "ActiveNodes", "Updates"]
        self.info = {}
        self.actives = {}

    # the callback function
    def __onConnect(self, client, userdata, flags, rc):
        print("Connected With Result Code {}".format(rc))
        for topic in self.topics:
            print( "subscribed to ", topic )
            client.subscribe(topic)

    def __onDisconnect(self, client, userdata, rc):
        print("Disconnected From Broker")

    def __onInfoMessage(self, client, userdata, message):
        msg = message.payload.decode()
        self.info = json.loads(msg)
        print( "got it", self.info )
        

    def __onActiveMessage(self, client, userdata, message):
        msg = message.payload.decode()
        self.actives = json.loads( msg )
        print( "got something: ", self.actives )

    def __onUpdateMessage(self, client, userdata, message):
        print(message.payload.decode())
        print(message.topic)

    # Getters
    def getInfo(self):
        print( "sending info: ", self.info )
        while ( len (self.info) == 0 ):
            time.sleep(.2)
            pass
        # print( self.info )
        return self.info

    def getActives(self):
        print( "sending actives", len( self.actives ) )
        while( len( self.actives ) == 0 ):
            time.sleep(.2)
            pass
        return self.actives


    def start(self):
        broker_address = "54.67.84.242"
        broker_portno = 1883
        client = mqtt.Client()

        # Assigning the object attribute to the Callback Function
        client.on_connect = self.__onConnect
        client.on_disconnect = self.__onDisconnect
        client.message_callback_add("NodeInfo", self.__onInfoMessage)
        client.message_callback_add("ActiveNodes", self.__onActiveMessage)
        client.message_callback_add("Updates", self.__onUpdateMessage)

        client.connect(broker_address, broker_portno)

        client.loop_forever()


threads = []

# Start subscriber
subscriber = MQTT()
threads.append( threading.Thread(target=subscriber.start, daemon=True).start() )

# start flask app
app = Flask(__name__)

@app.route('/active', methods=['GET'])
def get_active_nodes():
    print( "Inside active nodes list API call" )
    return jsonify(subscriber.getActives())


@app.route('/node', methods=['GET'])
def get_node_info():
    print( "Inside Node info API call", subscriber.getInfo() )
    return jsonify (subscriber.getInfo())


def task_update():
    return "task_updates"


def task_result():
    return "task result"


def run():
    app.run(debug=False)

try: 
    threads.append( threading.Thread(target = run).start() )

except KeyboardInterrupt:
    print("something")
    while len( threads ) > 0:
        for t in threads:
            t.join(1)
            print("killed")
    try:
        print("got")
        sys.exit(0)
    except SystemExit:
        print("killed")
        os._exit(0)