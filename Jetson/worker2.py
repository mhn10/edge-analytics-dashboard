import boto3
import subprocess
import sys, time

# Get service resource
sqs = boto3.resource( 'sqs' )

# Get the queue
queue = sqs.get_queue_by_name( QueueName='ReplyQueue' )

while True:
    # Process messages by printing out body and optional author name
    for message in queue.receive_messages( MessageAttributeNames = [ 'User', 'Name' ] ):
        # Get user name and action name
        user = ''
        name = ''
        if message.message_attributes is not None:
            user = message.message_attributes.get( 'User' ).get( 'StringValue' )
            # if user:
            #     user_name = ' ({0})'.format( user )
            name = message.message_attributes.get( 'Name' ).get( 'StringValue' )


        # Print out body and author
        print( "{0}:{1}, {2}".format( message.body, user, name ) )
        # Let the queue know that the message is processed
        message.delete()
