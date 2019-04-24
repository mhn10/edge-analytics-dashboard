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
import logging
import argparse
import platform, psutil

# Constants
# BROKER_ADDR = "iot.eclipse.org"
# BROKER_ADDR = "test.mosquitto.org"

BROKER_ADDR = "54.67.84.242"
BROKER_PORT = 1883
TOPIC_ACTIVE = "ActiveNodes"
TOPIC_INFO = "NodeInfo"

SQS_QUEUE_NAME = "NodeCommunication"


class MqttPublisher:
    def __init__( self ):
        # logging.basicConfig(level=logging.DEBUG)
        self.client = mqtt.Client()
        self.topics = {}
        self.sqs = boto3.resource( 'sqs' )


    def __getNodeInfo( self ):
        node_details = dict()
        # for key, value in js.items():
        #     node_details[key] = value

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

        return node_details


    def __publish( self, topic, payload ):
        self.client.publish(topic = topic, payload = json.dumps( payload ) )
        logging.debug( "Message published for topic {0}".format( topic ) )

        
    # Make connection with mqtt broker
    def connect( self, broker_addr, port, queue_name ):
        self.client.connect( broker_addr, port )
        logging.debug( "Client connected with broker" )

        self.queue = self.sqs.get_queue_by_name( QueueName = queue_name )
        logging.debug( "Listening on queue {}".format( queue_name ) )


    def setPublishTopics( self, topic_active, topic_info ):
        self.topicActive = topic_active
        self.topicInfo = topic_info

    def setUrls( self, active_rqst_url, info_rqst_url ):
        self.activeUrl = active_rqst_url
        self.infoUrl = info_rqst_url
    

    def start( self ):
        while True:
            i = 0
            for message in self.queue.receive_messages():
                print ( "Received message: {0}".format( message.body ) )
                if len(message.body) == 0:
                    pass
                js = json.loads( message.body )


                if ( js['action'] == "Active" ):
                    # Call to get list of members
                    r = requests.get( self.activeUrl )
                    # # Get JSON response
                    js = r.json()
                    print("Active: {0}, {1}".format( i, js ) )
                    i+=1
                    self.__publish( self.topicActive, js )

                    # message.delete()


                elif ( js['action'] == "Info" ):

                    r = requests.get( self.infoUrl )
                    
                    js = r.json()
                    # js = getMoreInfo( js )
                    print( self.__getNodeInfo() )
                    js.update( self.__getNodeInfo() )
                    print( js )
                    
                    print ("Info: {0}, {1}".format( i, js ) )
                    print( "publishing on: ", self.topicInfo )
                    self.__publish( self.topicInfo, js )
                
                message.delete()
                i += 1



def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('node_addr', type=str)
    parser.add_argument('node_port', type=str)
    args = parser.parse_args()
    print(args)

    active_rqst_url = "http://{0}:{1}/members".format( args.node_addr, args.node_port )
    info_rqst_url = "http://{0}:{1}/info".format( args.node_addr, args.node_port )
    print( active_rqst_url )
    print( info_rqst_url )

    mqttObj = MqttPublisher()
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
