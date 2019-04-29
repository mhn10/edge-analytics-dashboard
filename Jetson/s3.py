import configure
import boto3, botocore

class S3:
    def __init__( self ):
        # Something
        self.configuration = configure.getConfig()
        session = boto3.Session(
            aws_access_key_id=self.configuration['keyid'],
            aws_secret_access_key=self.configuration['key'],
            region_name=self.configuration['region']
        )
        self.s3_res = session.resource('s3')
        self.s3_cl = session.client('s3')


    def getResource( self, bucket_name ):
        return self.s3_res

    def getClient( self, bucket_name ):
        return self.s3_cl