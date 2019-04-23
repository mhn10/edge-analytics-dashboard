#########################################################
# This code will keep running and will publish list of  #
# all active nodes that are there in cluster            #
# every 30 seconds.                                     #
#                                                       #
#       by- Sahil Sharma                                #
#########################################################

# Import libraries
import paho.mqtt.client as mqtt
import requests
import time
import sys, os
import json
import boto3

# Constants
BROKER_ADDR = "iot.eclipse.org"
BROKER_PORT = 1883
TOPIC = "ActiveNodes"

REQUEST_URL = "http://localhost:4001/members"

sqs = boto3.resource( 'sqs' )
queue = sqs.get_queue_by_name( QueueName = 'NodeCommunication' )


def main():
    # activeNodes = []
    client = mqtt.Client()
    client.connect(BROKER_ADDR, BROKER_PORT )
    print( "Client connected" )
    i = 0
    while True:
        for message in queue.receive_messages():
            print( message.body )
            if ( message.body == "Active" ):
                # Call to get list of members
                r = requests.get( REQUEST_URL )
                # # Get JSON response
                js = r.json()
                print( i, js )
                i+=1
                
                client.publish(topic = TOPIC, payload = json.dumps( js ) )

            message.delete()
        # client.publish(topic = TOPIC, payload="hello")


if __name__ == '__main__':
    
    try:
        main()
    except KeyboardInterrupt:
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
# print(r.headers)

# for key, value in js.items():
#     node_details[key] = value

