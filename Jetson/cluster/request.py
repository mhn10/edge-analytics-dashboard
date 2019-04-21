import requests
import json
import paho.mqtt.client as mqtt

r = requests.get("http://192.168.0.119:4001/info")
js = r.json()
print(r.headers)

for key, value in js.items():
    print("{0}: {1}".format(key, value))


broker_address = "iot.eclipse.org"
broker_portno = 1883
client = mqtt.Client()

client.connect(broker_address, broker_portno)
client.publish(topic = "NodeInfo", payload = json.dumps(js))