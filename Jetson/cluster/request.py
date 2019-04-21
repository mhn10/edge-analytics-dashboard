import requests
import json
import paho.mqtt.client as mqtt
import platform
import psutil

node_details = dict()

# Call to get info of Nodes
r = requests.get("http://localhost:4001/info")
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


# Broker for our pub-sub
broker_address = "iot.eclipse.org"
broker_portno = 1883
# Start the client
client = mqtt.Client()
# Connect to broker
client.connect(broker_address, broker_portno)
# Publish the message
client.publish( topic = "NodeInfo", payload = json.dumps( node_details ) )