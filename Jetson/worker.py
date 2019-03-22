import pika
import time
import subprocess

# Worker is running on localhost and is checking if any task is assigned to the system
connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

# Name of queue that we are looking for
channel.queue_declare(queue='task_queue', durable=True)
print(' [*] Waiting for messages...')

def callback(ch, method, properties, body):
    body = body.decode('utf-8')
    # print(body)
    vals = body.split(' ')
    # print(vals)
    uid = vals[0]
    # uid = "001"
    # modelName = "IRIS.csv"
    # typeOfModel = "abc"
    modelName = vals[1]
    typeOfModel = vals[2]
    if len(vals) == 4:
        dataFileName = vals[3]
    else:
        dataFileName = ""

    # print(" [x] Received %r" % body)
    #time.sleep(body.count(b'.'))
    #print(" [x] Done")
    ch.basic_ack(delivery_tag = method.delivery_tag)
    # print("gonna run script now")
    subprocess.call(['python3','checkS3.py',uid,modelName,typeOfModel,dataFileName])
    # subprocess.call(['python3', 'Response.py', 'resultfilename'])

channel.basic_qos(prefetch_count=1)
channel.basic_consume(callback, queue='task_queue')

channel.start_consuming()
