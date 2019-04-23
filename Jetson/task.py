import boto3

# Get service resource
sqs = boto3.resource('sqs')

# Get the queue
queue = sqs.get_queue_by_name( QueueName='taskQ1' )

print( "[DEBUG]: Connected to queue: {}".format( queue.url ) )

# Get response on sending the message
# MessageBody: Name given by user
# MessageAttributes: UserName, Action type( Classification / Regression )

q = [ [ 'User001', 'Classification', 'MyFirstModel' ] ]

for task in q:
    response = queue.send_message( MessageBody = task[2], MessageAttributes = {
        'User': {
            'StringValue': task[0],
            'DataType': 'String'
        },
        'Type': {
            'StringValue': task[1],
            'DataType': 'String'
        }
    })
    print( "Sending: {0}->{1}:{2}".format( task[0], task[1], task[2] ) )

    print( response.get( 'Failed' ) )