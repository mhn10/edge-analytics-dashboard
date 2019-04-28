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
import time, datetime
import sys, os
import json
import boto3
import logging
import argparse
import platform, psutil 
import geocoder

# Constants
# BROKER_ADDR = "iot.eclipse.org"
# BROKER_ADDR = "test.mosquitto.org"

BROKER_ADDR = "54.67.84.242"
BROKER_PORT = 1883
TOPIC_ACTIVE = "ActiveNodes"
TOPIC_INFO = "NodeInfo"

SQS_QUEUE_NAME = "NodeCommunication"


class MQTT:
    def __init__( self ):
        self.client = mqtt.Client()
        self.topics = {}
        self.sqs = boto3.resource( 'sqs' )

    # Gather all info of the node
    def __getNodeInfo( self ):
        node_details = dict()
        
        # Node location
        node_details['location'] = geocoder.ip('me').latlng

        # Get machine details
        node_details['Aarchitecture'] = platform.machine()
        node_details['OS'] = platform.system()
        node_details['OS_Version'] = platform.release()

        # Get cpu info
        node_details['cpu_percent'] = psutil.cpu_percent()
        node_details['cpu_count'] = psutil.cpu_count()
        memory = psutil.virtual_memory()

        node_details['total_memory'] = round (memory.total / ( 1024 * 1024 * 1024 ), 2)
        node_details['memory_used'] = round (memory.used / ( 1024 * 1024 * 1024 ), 2)
        node_details['memory_available'] = round (memory.available / ( 1024 * 1024 * 1024 ), 2)

        temps =  psutil.sensors_temperatures()
        detail = {}
        
        for key, value in temps.items():
            detail[key] = []
            for val in value:
                f = val._fields
                temp = {}
                for n, k in zip( f, val ) :
                    temp[n] = k
                
                detail[key].append( temp )

        node_details['temperatue'] = detail

        return node_details


    # Publish node on topic
    def __publish( self, topic, payload ):
        self.client.publish(topic=topic, payload=payload, qos=0, retain=True )
        
        print( "Message {0} published for topic {1} at {2}".format( topic, payload, datetime.datetime.now() ) )

        
    # Make connection with mqtt broker
    def connect( self, broker_addr, port, queue_name ):
        self.client.connect( broker_addr, port )
        print("Client connected")

        self.queue = self.sqs.get_queue_by_name( QueueName = queue_name )
        print( "Listening on queue {}".format( queue_name ) )


    # Set topics on which to publish
    def setPublishTopics( self, topic_active, topic_info ):
        self.topicActive = topic_active
        self.topicInfo = topic_info


    # set local api url for node info and members list
    def setUrls( self, active_rqst_url, info_rqst_url ):
        self.activeUrl = active_rqst_url
        self.infoUrl = info_rqst_url
    

    def start( self ):
        self.__getNodeInfo()
        while True:
            # Get messag from SQS
            for message in self.queue.receive_messages():
                print ( "Received message {0} from SQS at: {1}".format( message.body, datetime.datetime.now() ) )
                if len(message.body) == 0:
                    pass
                js = json.loads( message.body )

                try:
                    # Check if list of active nodes is asked
                    # If it is, then do a get call to our cluster and 
                    # get list of active nodes
                    if ( js['action'].lower()  == "active" ):
                        print("[DEBUG]: Sending active nodes")
                        # Call to get list of members
                        r = requests.get( self.activeUrl )

                        # # Get JSON response
                        js = json.dumps( r.json() )
                        
                        self.__publish( self.topicActive, js )

                        message.delete()

                    # Check if request if for Node info
                    elif ( js['action'].lower() == "info" ):
                        print("[DEBUG]: Sending info")
                        r = requests.get( self.infoUrl )
                        js2 = r.json()
                        
                        # Validate node info
                        # If we are the correct node then reply with correct info
                        try:
                            if ( js['Node'].lower() == js2['Name'].lower() ):
                                print( self.__getNodeInfo() )
                                js2.update( self.__getNodeInfo() )

                                js2 = json.dumps( js2 )
                                
                                self.__publish( self.topicInfo, js2 )
                                message.delete()
                        except KeyError:
                            print("ERROR: KEY ERROR")
                            message.delete()
                            pass


                except KeyError:
                    print("ERROR: KEY ERROR")
                    message.delete()
                    pass


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('node_addr', type=str)
    parser.add_argument('node_port', type=str)
    args = parser.parse_args()

    active_rqst_url = "http://{0}:{1}/members".format( args.node_addr, args.node_port )
    info_rqst_url = "http://{0}:{1}/info".format( args.node_addr, args.node_port )
    print( active_rqst_url )
    print( info_rqst_url )

    mqttObj = MQTT()
    mqttObj.setPublishTopics( TOPIC_ACTIVE, TOPIC_INFO )
    mqttObj.setUrls( active_rqst_url, info_rqst_url )
    mqttObj.connect( BROKER_ADDR, BROKER_PORT, SQS_QUEUE_NAME )
    mqttObj.start()


if __name__ == '__main__':
    
    try:
        main()
    except KeyboardInterrupt:
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
