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
                if ( js['action'].lower()  == "active" ):
                    print("[DEBUG]: Sending active nodes")

                    r = requests.get( "http://localhost:4001/members" )

                    # Get JSON response
                    js = json.dumps( r.json() )
                    mqttObj.publish( topic_active_nodes, js )
                    message.delete()

                # Check if request if for Node info
                elif ( js['action'].lower() == "info" ):
                    print("[DEBUG]: Sending info")
                    r = requests.get( "http://localhost:4001/info" )
                    js2 = r.json()
                    
                    # Validate node info
                    # If we are the correct node then reply with correct info
                    try:
                        if ( js['node'].lower() == js2['Name'].lower() ):
                            js2.update( node.getNodeInfo() )

                            js2 = json.dumps( js2 )
                            mqttObj.publish( topic_node_info, js2 )
                            message.delete()
                    except KeyError:
                        print("ERROR: KEY ERROR")
                        message.delete()
                        pass
            except:
                print("ERROR")
                message.delete()
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