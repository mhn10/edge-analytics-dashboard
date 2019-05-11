#################################################################
# This file contains a forever connection to MQTT broker        #
# waiting for messages to be published in intereseted topics.   #
# A flask server will also start here which provide end-points  #
# to access the values updated by MQTT subscriber.              #
#                                                               #
#           Written by- Sahil Sharma                            #
#################################################################


# Required Libraries
from flask import Flask, jsonify, request
from flask import Response, stream_with_context
import paho.mqtt.client as mqtt
import sys
import os
import json
import threading
import time, datetime
from flask_cors import CORS

class MQTT:
    def __init__(self):
        self.topics = ["NodeInfo", "ActiveNodes", "Updates"]
        self.info = {}
        self.actives = {}
        self.updates = dict()

    # the callback function
    def __onConnect(self, client, userdata, flags, rc):
        print("Connected With Result Code {}".format(rc))
        for topic in self.topics:
            print( "subscribed to ", topic )
            self.client.subscribe(topic)

    def __onDisconnect(self, client, userdata, rc):
        print("Disconnected From Broker")

    def __onInfoMessage(self, client, userdata, message):
        msg = message.payload.decode()
        self.info = json.loads(msg)
        print( "got info {0} at {1}".format(self.info, datetime.datetime.now()) )

    def __onActiveMessage(self, client, userdata, message):
        msg = message.payload.decode()
        self.actives = json.loads( msg )
        print( "got active: {0} at {1}".format(self.actives, datetime.datetime.now()) )

    def __onUpdateMessage(self, client, userdata, message):
        # print(message.payload.decode())
        msg = json.loads( message.payload.decode() )
        # print( type( msg ) )

        
        # Check if there is existing data for the user
        if msg['userName'] in self.updates:

            # Now check if the task is existing or not
            for idx in range( len( self.updates[ msg['userName'] ] ) ):
            
                if msg['taskName'] in self.updates[ msg['userName'] ][idx]:
                    # Check if this task is completed or not
                    # print("CEHCK: ", self.updates[ msg['userName'] ][idx][ msg['taskName'] ][0] )
                    if self.updates[ msg['userName'] ][idx][ msg['taskName'] ][0]["status"] == "Done":
                        self.updates[msg['userName']][idx][msg['taskName']] = [{ 
                                "nodeID": msg["nodeID"], 
                                "time": msg["time"], 
                                "status": msg["status"],
                                "displayed": False
                            }]
                        
                    else:
                        self.updates[msg['userName']][idx][msg['taskName']].append( 
                            { 
                                "nodeID": msg["nodeID"], 
                                "time": msg["time"], 
                                "status": msg["status"],
                                "displayed": False
                            }
                        )
                else:
                    self.updates[msg['userName']].append( 
                        { 
                            msg["taskName"] :
                            [ { 
                                "nodeID": msg["nodeID"], 
                                "time": msg["time"], 
                                "status": msg["status"],
                                "displayed": False
                            } ]
                        } 
                    )
        else:
            print( "CHECK: Creating once" )
            if msg['status'] != "Done":
                self.updates[msg['userName']] = [ { msg["taskName"]: [ { "nodeID": msg["nodeID"], "time": msg["time"], "status": msg["status"], "displayed": False } ] } ]


        print( self.updates )
        print("============================================")
        

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

    def getUpdates( self, userName, taskName ):
        print( "Sending updates" )
        # Travel through each task of that user
        # if userName not in self.updates:
        #     msg = {"status":"No data for user"}
        #     return json.dumps( msg )
        
        
        is_done = False

        while not is_done:
            if userName not in self.updates:
                time.sleep( 0.02 )
                continue

            # print( "[CHECK]: ", self.updates[userName] )

            for tasksIdx in range( len( self.updates[userName] ) ):
                # Check if task is correct one
                if taskName in self.updates[userName][tasksIdx]:
                    for idx in range( len( self.updates[userName][tasksIdx][taskName] ) ):
                        if not self.updates[userName][tasksIdx][taskName][idx]["displayed"]:
                            yield json.dumps( self.updates[userName][tasksIdx][taskName][idx] )
                            yield '\n'
                            self.updates[userName][tasksIdx][taskName][idx]["displayed"] = True

                        if( self.updates[userName][tasksIdx][taskName][idx]['status'] == "Done" ):
                            # self.updates[userName] = [ { taskName: [] } ]
                            del self.updates[userName]
                            is_done = True
                            return
                else:
                    msg = {"status": "No pending task"}
                    yield json.dumps( msg )
                    yield '\n'
                    is_done = True

            time.sleep(.02)


    def start(self):
        broker_address = "54.67.84.242"
        broker_portno = 1883
        self.client = mqtt.Client()

        # Assigning the object attribute to the Callback Function
        self.client.on_connect = self.__onConnect
        self.client.on_disconnect = self.__onDisconnect
        self.client.message_callback_add("NodeInfo", self.__onInfoMessage)
        self.client.message_callback_add("ActiveNodes", self.__onActiveMessage)
        self.client.message_callback_add("Updates", self.__onUpdateMessage)

        self.client.connect(broker_address, broker_portno)

        self.client.loop_forever()


threads = []

# Start subscriber
subscriber = MQTT()
threads.append( threading.Thread(target=subscriber.start, daemon=True).start() )

# start flask app
app = Flask(__name__)
CORS(app)
@app.route('/active', methods=['GET'])
def get_active_nodes():
    print( "Inside active nodes list API call" )
    return jsonify(subscriber.getActives())


@app.route('/node', methods=['GET'])
def get_node_info():
    print( "Inside Node info API call", subscriber.getInfo() )
    return jsonify (subscriber.getInfo())

# End point for updates of task
@app.route('/updates', methods=['GET'] )
def get_updates():
    # print( "Inside updates call" )
    # if request.method == 'GET':
    userName = request.args.get('userName', '')
    taskName = request.args.get('taskName', '')
    return Response( stream_with_context( subscriber.getUpdates(userName, taskName) ), mimetype='text/plain', content_type="text/event-stream")
    # return Response( stream_with_context( subscriber.getUpdates(userName, taskName) ), mimetype='application/json', content_type="application/json")

# Demo router that Returns response as text
@app.route('/demo', methods=['GET'] )
def demo( ):
    userName = request.args.get('userName', '')
    taskName = request.args.get('taskName', '')

    def generator():
        for i in range( 0, 5 ):
            js = { "nodeID": "Jetson", "time": "Wed May  8 22:15:14 2019", "status": "Hello World {}".format( i ), "displayed": False }
            yield json.dumps( js )
            time.sleep(2)
    
    return Response( generator(), mimetype='text/plain', content_type="text/event-stream")

# Demo router that Returns response as json
@app.route('/demojs', methods=['GET'] )
def demojs( ):
    userName = request.args.get('userName', '')
    taskName = request.args.get('taskName', '')

    def generator():
        for i in range( 0, 5 ):
            js = { "nodeID": "Jetson", "time": "Wed May  8 22:15:14 2019", "status": "Hello World {}".format( i ), "displayed": False }
            yield json.dumps( js )
            time.sleep(2)
    
    return Response( stream_with_context( generator() ), mimetype='application/json', content_type="application/json")


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
