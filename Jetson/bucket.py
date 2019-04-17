#####################################################################################################
# This code is called by Worker which then handle the complete task                                 #
# ans ends with replying with output file or error message to server                                #
#                                                                                                   #
# Author: Sahil Sharma                                                                              #
# Last Edited: Apr 13, 2019                                                                         #
#####################################################################################################

import boto3, botocore
import subprocess
import sys, os, shutil
import time
from collections import defaultdict


class Jetson:
    def __init__( self ):
        self.__bucketName = ''
        self.__allFiles = defaultdict( list )
        self.__userName = ''
        self.__taskType = ''
        self.__uploadName = ''
        self.__path = ''
    
    
    def __deleteDirs( self, path ):
        if os.path.exists( path ):
            shutil.rmtree( path )
    

    def SetUser( self, user_name, task_type, upload_name):
        self.__userName = user_name
        self.__taskType = task_type
        self.__uploadName = upload_name


    def SyncWithS3( self, bucket_name ):
        self.__bucketName = bucket_name

        # Get the reouserce
        s3 = boto3.resource( 's3' )

        #Fetch the bucket
        bucket = s3.Bucket( self.__bucketName )

        # self.__deleteDirs( self.__userName + '/' )

        # Set path
        self.__path = self.__userName + '/' + self.__taskType + '/' + self.__uploadName + '/'

        # Find objects that we want to download
        # for obj in bucket.objects.filter( Prefix = self.__path ):

        #     # Get path and filenames of object
        #     path, filename = os.path.split( obj.key )
        #     path += '/'
        #     # print( "path: {0}, file: {1}".format( path, filename ) )

        #     # If filename is empty, that means we have to create directory
        #     if not filename:
        #         os.makedirs( path )
            
        #     # If filename is there, then we download that file
        #     if len( filename ) > 0:
        #         try:
        #             s3.Bucket( self.__bucketName ).download_file( obj.key, obj.key )
        #         except botocore.exceptions.ClientError as e:
        #             if e.response['Error']['Code'] == "404":
        #                 print("The object does not exist.")
        #             else:
        #                 print( "An error encountered" )
        #                 return False
        return True


    def CollectFiles( self ):

        # Load files ( valid for Classification only )
        # print( "Code" )
        for file in os.listdir( self.__path + 'Code/' ):
            # print( file )
            self.__allFiles['code'].append( self.__path + 'Code/' + file )
        
        # print( "Data" )
        for file in os.listdir( self.__path + 'Data/' ):
            # print( file )
            self.__allFiles['data'].append( self.__path + 'Data/' + file )

        # print( "Requirements" )
        for file in os.listdir( self.__path + 'Requirements/' ):
            # print( file )
            self.__allFiles['requirements'].append( self.__path + 'Requirements/' + file )

        # print( "input" )
        for file in os.listdir( self.__path + 'Input/' ):
            # print( file )
            self.__allFiles['input'].append( self.__path + 'Input/' + file )

        # print( "result" )
        for file in os.listdir( self.__path + 'Result/' ):
            # print( file )
            self.__allFiles['result'].append( self.__path + 'Result/' + file )
        
        # print( "model" )
        for file in os.listdir( self.__path + 'Model/' ):
            # print( file )
            self.__allFiles['model'].append( self.__path + 'Model/' + file )


    def CreateVirtualEnv( self ):
        env_name = 'env-' + self.__userName
        commands = { 'create': 'python3 -m venv {0}'.format( env_name ),
                    'activate': 'source {0}/bin/activate'.format( env_name ),
                    'install': 'pip3 install -r {0}'.format( self.__allFiles['requirements'][0] ),
                    'run': 'python3 {0}'.format( self.__allFiles['code'][0] ),
                    'deactivate': 'deactivate' }

        
        for command in commands.values():
            print( command )


        subprocess.call( commands['create'], shell=True )
        # Activate the environment
        # start = time.time()
        # file = "test.py"

        # commands = { 'activate': 'source env/bin/activate',
        #             'install': 'pip3 install -r {0}'.format( file ),
        #             'run': 'python3 {0}'.format( code ),
        #             'deactivate': 'deactivate' }

        myProcess = subprocess.Popen( '{0}; {1}; {2}'.format( commands['activate'], commands['install'], commands['deactivate'] ), shell=True, stdout = subprocess.PIPE, stderr=subprocess.PIPE )
        print( "Done" )
        
        [outStream, errStream] = myProcess.communicate()
        print( outStream )
        print( errStream )
        
        # [outStream, errStream] = myProcess.communicate("deactivate")
        # print( "deactivated" )
        myProcess.kill()


# BUCKET_NAME = "vision-analytics-bucket"

# S3(): fetches required file from S3 bucket
# @param userName: user's whose folder we have to check
# @param taskName: task selected by user ( classification / regression )
# @param uploadName: name given by user at the time of upload
# def S3( userName, taskName, uploadName ):
#     # Get the reouserce
#     s3 = boto3.resource( 's3' )
    
#     # Fetch the bucket
#     bucket = s3.Bucket( BUCKET_NAME )
    
#     # Key is kind of path from where we want to download
#     KEY = userName + '/' + taskName + '/' + uploadName + '/'
#     print( KEY )

#     # We want to create similar folder structure locally, if one already exist, get rid of it
#     if os.path.exists( userName + '/' ):
#         shutil.rmtree( userName + '/' )

#     # Find objects that we want to download
#     for obj in bucket.objects.filter( Prefix = str(KEY) ):
#         print( obj.key )

#         # Get path and filenames of object
#         path, filename = os.path.split( obj.key )
#         path += '/'
#         # print( "path: {0}, file: {1}".format( path, filename ) )

#         # If filename is empty, that means we have to create directory
#         if not filename:
#             os.makedirs( path )
        
#         # If filename is there, then we download that file
#         if len( filename ) > 0:
#             try:
#                 s3.Bucket( BUCKET_NAME ).download_file( obj.key, obj.key )
#                 print( "Done" )
#             except botocore.exceptions.ClientError as e:
#                 if e.response['Error']['Code'] == "404":
#                     print("The object does not exist.")
#                 else:
#                     print( "An error encountered" )
#                     return False
    
    
#     return True


# def CollectFiles( path ):
#     # files = os.listdir( path )
#     # print( files )

#     # First take code file
    
#     code_file = os.listdir( path + 'Code/' )
#     print( code_file )
#     model_file = 



# Create virtual environment and install dependencies
# def CreateVirtualEnv():
#     # Create a virtual environment
#     subprocess.call( 'python3 -m venv env', shell=True )
#     # Activate the environment
#     # start = time.time()
#     file = "test.py"

#     # commands = { 'activate': 'source env/bin/activate',
#     #             'install': 'pip3 install -r {0}'.format( file ),
#     #             'run': 'python3 {0}'.format( code ),
#     #             'deactivate': 'deactivate' }

#     myProcess = subprocess.Popen( 'source env/bin/activate; pip3 install tensorflow; python3 {0}; deactivate'.format( file ), shell=True, stdout = subprocess.PIPE, stderr=subprocess.PIPE )
#     print( "activated" )
    
#     [outStream, errStream] = myProcess.communicate()
#     print( outStream )
#     # print( errStream )
    
#     # [outStream, errStream] = myProcess.communicate("deactivate")
#     # print( "deactivated" )
#     myProcess.kill()
#     # subprocess.call( 'rm -r env/', shell=True )
#     # myProcess.
#     # subprocess.call( 'deactivate', shell=True )
    

# Run user's code using all the required files
# def runCode( userName ):
#     subprocess.Popen(['python3', 'task2.py', "Success", userName ] )


# Delete all the local creation after task is over
def clean( userName ):
    if os.path.exists( userName + '/' ):
        shutil.rmtree( userName + '/' )
    
    if os.path.exists( 'env/' ):
        shutil.rmtree( 'env/' )
    # subprocess.call( [ 'rm', '-r', ])



def main():
    # We get 3 parameters as username( username / user id ), taskname( classification / regression ) , and uploadname( one that user gives )
    userName = sys.argv[1]
    taskName = sys.argv[2]
    uploadName = sys.argv[3]

    j = Jetson()
    j.SetUser( userName, taskName, uploadName )
    j.SyncWithS3( 'vision-analytics-bucket' )
    j.CollectFiles()
    j.CreateVirtualEnv()
    

    # Download all required files
    # if not S3( userName, taskName, uploadName ):
    #     # Send message back to server about the error
    #     print ( "Error in downloading files" )
    #     subprocess.Popen(['python3', 'task2.py', "Error", userName, uploadName ] )
    # else:
    # CollectFiles( userName + '/' + taskName + '/' + uploadName + '/' )
    # CreateVirtualEnv()
        # runCode( userName )
    # print( "Sent" )
        
    
    # clean( userName )
    
 
if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)


###########################
#   Other Stuff
###########################

# **List buckets**
# response = s3.list_buckets()
# buckets = [bucket['Name'] for bucket in response['Buckets']]
# print( buckets )

# When we want to get objects starting with some prefix
# bucket.objects.filter(Prefix='myModel01/')

# **List objects in bucket**
# for obj in bucket.objects.all():
#     print(obj.key)



# User001, Classification, MyFirstModel
# User001, Classification, SecondModel
# User001, Regression, FirstML
# User002, Classification, MyFirstModel
# User002, Regression, Test
