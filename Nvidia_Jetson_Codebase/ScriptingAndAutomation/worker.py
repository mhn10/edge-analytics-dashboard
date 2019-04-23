import boto3
import subprocess
import sys, time, os
import json

# Get service resource
sqs = boto3.resource( 'sqs' )

# Get the queue
queue = sqs.get_queue_by_name( QueueName='taskQ1' )

try:
    print( "Worker started" )
    while True:
        # Process messages by printing out body and optional author name
        for message in queue.receive_messages():

            js = json.loads(message.body)

            # Print out body and author
            print('Name: {0} '.format( js ) )
            subprocess.Popen( [ 'python3', 'bucket.py', js['userName'], js['actionType'], js['taskName'] ] )
            # Let the queue know that the message is processed
            message.delete()
        
except KeyboardInterrupt:
    print('Interrupted')
    try:
        sys.exit(0)
    except SystemExit:
        os._exit(0)
