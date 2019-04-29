import paho.mqtt.client as mqtt
import configure

class MQTT:
    def __init__(self):
        self.client = mqtt.Client()

    def __onConnect( self, client, userdata, flags, rc ):
        print("Connected")

    def __onDisconnect( self, client, userdata, rc ):
        print("Disconnected")
    
    def start(self):
        self.client.on_connect = self.__onConnect
        self.client.on_disconnect = self.__onDisconnect
        ip = configure.getConfig()['broker_addr']
        port = int(configure.getConfig()['broker_port'])
        self.client.connect( ip, port )
        
        # return self.client

    def publish(self, topic, payload):
        print("[DEBUG]: Publishing message: {0} on queue: {1}".format(payload, topic))
        self.client.publish(topic=topic, payload=payload, qos=0, retain=True)