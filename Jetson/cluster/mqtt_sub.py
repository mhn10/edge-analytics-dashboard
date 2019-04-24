import sys, os
import json
import paho.mqtt.client as mqtt

#the callback function
def on_connect(client, userdata, flags, rc):
    print("Connected With Result Code {}".format(rc))
    client.subscribe("NodeInfo")
    client.subscribe("ActiveNode")
    client.subscribe("TestResults")

def on_disconnect(client, userdata, rc):
    print("Disconnected From Broker")

def on_message_info(client, userdata, message):
    print("Got the node info")
    msg = message.payload.decode()
    m_json = json.loads(msg)

    for key, value in m_json.items():
        print("{0}: {1}".format(key, value))

    # print(m_json)
    # print(message.topic)

def on_message_active(client, userdata, message):
    print("Got list of all nodes")
    print(message.payload.decode())
    print(message.topic)

def on_message_result(client, userdata, message):
    print("Got test results")
    print(message.payload.decode())
    print(message.topic)

try:
    broker_address = "broker.hivemq.com"
    broker_portno = 1883
    client = mqtt.Client()

    #Assigning the object attribute to the Callback Function
    client.on_connect = on_connect
    client.on_disconnect = on_disconnect
    client.message_callback_add("NodeInfo", on_message_info)
    client.message_callback_add("ActiveNodes", on_message_active)
    client.message_callback_add("TestResults", on_message_result)

    client.connect(broker_address, broker_portno)

    client.loop_forever()
except KeyboardInterrupt:
    try:
        sys.exit(0)
    except SystemExit:
        os._exit(0)