# This file contains the response that need to be sent back to server
import sys
import pika

credentials=pika.PlainCredentials('jetson','jetson')
connection = pika.BlockingConnection(pika.ConnectionParameters('52.53.254.234',5672,'/',credentials))
channel = connection.channel()

channel.queue_declare(queue='task_queue', durable=True)

message = sys.argv[1]
channel.basic_publish(exchange='', routing_key='task_queue',body=message,
                    properties=pika.BasicProperties(delivery_mode=2,))
print(" [x] Sent %r" % message)
connection.close()
