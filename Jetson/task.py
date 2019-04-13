import boto3

# Get service resource
sqs = boto3.resource('sqs')

# Get the queue
queue = sqs.get_queue_by_name( QueueName='taskQ1' )

print( "[DEBUG]: Connected to queue: {}".format( queue.url ) )

# Get response on sending the message
# MessageBody: Name given by user
# MessageAttributes: UserName, Action type( Classification / Regression )
response = queue.send_message(MessageBody='MyModel01', MessageAttributes={
    'User': {
        'StringValue': 'User001',
        'DataType': 'String'
    },
    'Type': {
        'StringValue': 'Classfication',
        'DataType': 'String'
    }
})

print( response.get( 'Failed' ) )