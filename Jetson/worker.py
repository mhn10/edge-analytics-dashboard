import boto3
import sys, time

# Get service resource
sqs = boto3.resource( 'sqs' )

# Get the queue
queue = sqs.get_queue_by_name( QueueName='taskQ1' )

while True:
    # Process messages by printing out body and optional author name
    for message in queue.receive_messages( MessageAttributeNames = [ 'User', 'Type' ] ):
        # Get the custom author message if it was set
        user_name = ''
        action_name = ''
        if message.message_attributes is not None:
            user = message.message_attributes.get( 'User' ).get( 'StringValue' )
            action = message.message_attributes.get( 'Type' ).get( 'StringValue' )
            if user:
                user_name = ' ({0})'.format( user )
            if action:
                action_name = ' ({0})'.format( action )

        # Print out body and author
        print('{0}->user: {1}, Name: {2}, Type: {3}'.format( sys.argv[1], user_name, message.body, action_name ) )
        time.sleep( 1 )
        # Let the queue know that the message is processed
        message.delete()
