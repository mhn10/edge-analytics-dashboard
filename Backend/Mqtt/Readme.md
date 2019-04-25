# Creating MQTT subscriber and Flask server

MQTT subscriber will be subscribed to required topics and will keep list of active members as well as node info.  
For using _server.py_ use following steps:  
1. Install Python dependencies using
```console
foo@bar:~$ pip3 install -r requirements.txt
```
2. Start server by
```console
python3 server.py
```
It will start subscriber as well as Flask server with 2 endpoints for node info (/node) and active nodes (/active). Flask server will run on port 5000.