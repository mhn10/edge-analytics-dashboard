# Readme for Codes deployed on Jetson TX2

## Automation
### How things will work for automation
1. There will be a Worker always running on Jetson waiting for any task to arrive.  
2. When a task is arrived, Worker will start another script that will download files from S3 and create similar folder structrure  
3. After that Jetson will create a virtual environment and install dependencies in that.  
4. Later, the code will be run.  
5. Result will be uploaded to AWS S3 and server will be notified regarding this.  

### What's working in automation
1. Receive message from SQS queue.
2. Based on provided parameters, pull files from S3 bucket.  
3. After pulling all files and storing them locally, create virtual environment.  
4. Install all dependencies in Virtual environment based on _Requirements.txt_.  
5. Activate the environment, run the code and deactivate the environment after code execution is completed.  

### Problem with this automation and what's remaining
#### What are current problems
1. Right now different types of files are stored in different folders, so when code is running and it require other files, code will fail if we assume user has written code when all files were in same location.  
2. When installing with _requirements.txt_, we are using `pip3 install -r requirements.txt`. This command doesn't entertain when some dependencies are installed in some other ways, for instance, _ImageAI_ is installed as `pip3 install https://github.com/OlafenwaMoses/ImageAI/releases/download/2.0.2/imageai-2.0.2-py3-none-any.whl` which will fail in traditional style.  
#### What's Remaining?
1. Upload output file back to S3.  
2. Let server know that output has been generated.  

## Clustering
### Why Clustering?
Let's consider a case where we have multiple edge nodes, how would we know which one is alive or which one is dead? One way is that server will ping each edge node to check if its active or not. But what if we have 10,000 nodes, then server will have to ping all these nodes, while being connected to messaging queues and accepting API calls from users. This will take a lot of network bandwidth. Okay, chuck this, what if we have multiple servers? Then each server will be pinging each node to get active status. So, 100 servers and 1000 nodes will result in 100,000 pings. that's a lot of message in a large scale system.  

To reduce this consumption of network bandwidth, we adopted Gossip protocol. In this, we create cluster of all edge nodes, and each node will maintain list of active and dead nodes. In this, each node will ping randomly selected subset of nodes (say 4 nodes in a cluster of 50 nodes), while pinging, each node will send metadata that could be list of active nodes or addition of new nodes or removal of nodes. When those 4 nodes receive data, they will pass on to their subset, in this way the information will be dissipated in the cluster and eventually all nodes will have the information. So when a server needs to get list of active nodes, any one node can provide the information. Same clustering will occur at server side where they will share information of active nodes among themselves in similar fashion.  

More on Gossip protocol can be read from [ "SWIM: Scalable Weakly-consistent Infection-style Process Group Membership Protocol"](https://ieeexplore.ieee.org/document/1028914/)(SWIM).  
~~We are using **[Tattle](https://github.com/kippandrew/tattle)**, which is a Python based implementation of SWIM protocol.~~

With Tattle we faced issues since it was not currently being supported and dependencies were out of date. We moved towards HashiCorp's implementation of SWIM protocol as **memberlist** which is their implementation of Gossip protocol. More about it can be read from [website](https://www.serf.io/docs/internals/gossip.html) and their implementation can be read from their [Github](https://github.com/hashicorp/memberlist).

### What we have to do
1. Create cluster of nodes.  
2. Store list of all active and dead nodes.  
3. Create API to get list of all active and nodes.  

### How to use [cluster.go](https://github.com/mhn10/edge-analytics-dashboard/blob/NodesStatus/Jetson/cluster/cluster.go)
1. Put file in a directory and name it properly, say, _cluster_.
2. Do `go get` to install all the dependencies.  
3. Build the project using `go build`  
4. Run first node using 
```cluster
foo@bar:~$ ./cluster
Local member 192.168.0.119:8000
Listening on :4001
```
5. For any subsequent nodes run
```console
foo@bar:~$ ./cluster --members=192.168.119:8000 --port=4002 --bindPort=7000
```
This will create another node creating a cluster with first node.
6. To get list of members
```console
foo@bar:~$ curl -X GET http://localhost:4001/members
```
7. To get detail of current member
```console
foo@bar:~$ curl -X GET http://localhost:4001/info
```