import configure
import boto3

class SQS:
    def __init__( self ):
        # Something
        self.configuration = configure.getConfig()
        session = boto3.Session(
            aws_access_key_id=self.configuration['keyid'],
            aws_secret_access_key=self.configuration['key'],
            region_name=self.configuration['region']
        )
        self.sqs = session.resource('sqs')

    def getNodeCommQueue( self ):
        return self.sqs.get_queue_by_name( QueueName = self.configuration['nodeQ'] )

    def getTaskQueue( self ):
        return self.sqs.get_queue_by_name( QueueName = self.configuration['taskQ'] )
