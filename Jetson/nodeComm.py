
# This script handles communications regarding node details
# and active nodes
import mqtt
import sqs
import node
import datetime, time
import json
import requests
import sys, os

def main():
    mqttObj = mqtt.MQTT()
    mqttObj.start()

    topic_active_nodes = "ActiveNodes"
    topic_node_info = "NodeInfo"
    topic_updates = "Updates"


    sqsObj = sqs.SQS()
    queue = sqsObj.getNodeCommQueue()
    print("[DEBUG]: Connected to queue")

    while True:
        for message in queue.receive_messages():
            print ( "Received message {0} from SQS at: {1}".format( message.body, datetime.datetime.now() ) )
            if len(message.body) == 0:
                pass

            try:
                js = json.loads( message.body )
                # Check if list of active nodes is asked
                # If it is, then do a get call to our cluster and 
                # get list of active nodes

                print( "[DEBUG]: Message received ", js )
                if ( js['action'].lower()  == "active" ):
                    print("[DEBUG]: Active nodes message")


                    r = requests.get( "http://localhost:4001/members" )

                    # Get JSON response
                    js = json.dumps( r.json() )
                    mqttObj.publish( topic_active_nodes, js )

                    print( "deleting message" )

                    message.delete()

                # Check if request if for Node info
                elif ( js['action'].lower() == "info" ):

                    print("[DEBUG]: Info message")
                    r = requests.get( "http://localhost:4001/info" )
                    js2 = r.json()

                    # Validate node info
                    # If we are the correct node then reply with correct info
                    try:
                       if ( js['node'].lower() == js2['Name'].lower() ):
                           print( "sending node info: ", js )
                           js2.update( node.getNodeInfo() )

                           js2 = json.dumps( js2 )
                           mqttObj.publish( topic_node_info, js2 )
                           print( "Deleting message" )
                           message.delete()
                    except KeyError as e:
                        print("[ERROR]: KEY ERROR", js)
                        payload = {"Status":"601", "Msg":"Invalid key"}

                        # mqttObj.publish( topic_updates, json.dumps( payload ) )
                        message.delete()
                        pass
            except:
                print("ERROR in message format")
                payload = {"Status":"601", "Msg":"Invalid JSON format"}

                # mqttObj.publish( topic_updates, json.dumps( payload ) )
                message.delete()
                print( "deleting message" )
                pass

        time.sleep(0.01)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)

