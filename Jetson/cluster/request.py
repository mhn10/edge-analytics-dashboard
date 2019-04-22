import requests
import json
import paho.mqtt.client as mqtt
import platform
import psutil
import boto3


# Constants
BROKER_ADDR = "iot.eclipse.org"
BROKER_PORT = 1883
TOPIC = "NodeInfo"

REQUEST_URL = "http://localhost:4001/info"

node_details = dict()

# Call to get info of Nodes
r = requests.get( REQUEST_URL )
# Get JSON response
js = r.json()
# print(r.headers)

for key, value in js.items():
    node_details[key] = value

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


# Start the client
client = mqtt.Client()
# Connect to broker
client.connect( BROKER_ADDR, BROKER_PORT )
# Publish the message
client.publish( topic = TOPIC, payload = json.dumps( node_details ) )