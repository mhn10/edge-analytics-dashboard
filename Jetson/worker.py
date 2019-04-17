import boto3
import subprocess
import sys, time, os

# Get service resource
sqs = boto3.resource( 'sqs' )

# Get the queue
queue = sqs.get_queue_by_name( QueueName='taskQ1' )

try:
    while True:
        # Process messages by printing out body and optional author name
        for message in queue.receive_messages( MessageAttributeNames = [ 'User', 'Type' ] ):
            # Get user name and action name
            user = ''
            action = ''
            if message.message_attributes is not None:
                user = message.message_attributes.get( 'User' ).get( 'StringValue' )
                action = message.message_attributes.get( 'Type' ).get( 'StringValue' )
                # if user:
                #     user_name = ' ({0})'.format( user )
                # if action:
                #     action_name = ' ({0})'.format( action )

            # Print out body and author
            print('user: {0}, Name: {1}, Type: {2}'.format( user, message.body, action ) )
            subprocess.Popen( [ 'python3', 'bucket.py', user, action, message.body ] )
            # Let the queue know that the message is processed
            message.delete()
except KeyboardInterrupt:
    print('Interrupted')
    try:
        sys.exit(0)
    except SystemExit:
        os._exit(0)
