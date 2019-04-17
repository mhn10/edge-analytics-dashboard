# To send reply back to server
import boto3
import sys

# Get service resource
sqs = boto3.resource('sqs')

# Get the queue
queue = sqs.get_queue_by_name( QueueName='ReplyQueue' )

print( "[DEBUG]: Connected to queue: {}".format( queue.url ) )

# Get response on sending the message
# MessageBody: Name given by user
# MessageAttributes: UserName, Action type( Classification / Regression )
response = queue.send_message( MessageBody = sys.argv[1], MessageAttributes = {
    'User': {
        'StringValue': sys.argv[2],
        'DataType': 'String'
    },
    'Name': {
        'StringValue': sys.argv[3],
        'DataType': 'String'
    }
})

print( response.get( 'Failed' ) )