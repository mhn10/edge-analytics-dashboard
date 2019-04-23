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
        self.__files = defaultdict( )
        self.__userName = ''
        self.__actionName = ''
        self.__taskName = ''
        self.__path = ''
        self.__envName = 'env-'
    
    
    def __deleteDirs( self, path ):
        if os.path.exists( path ):
            shutil.rmtree( path )
    
    # Set user name ,task name and action type
    def SetUser( self, user_name, action_name, task_name):
        self.__userName = user_name
        self.__actionName = action_name
        self.__taskName = task_name


    def SyncWithS3( self, bucket_name ):
        self.__bucketName = bucket_name

        # Get the reouserce
        s3 = boto3.resource( 's3' )

        #Fetch the bucket
        bucket = s3.Bucket( self.__bucketName )

        # self.__deleteDirs( self.__userName + '/' )

        # Set path
        self.__path = self.__userName + '/' + self.__actionName + '/' + self.__taskName + '/'

        # Find objects that we want to download
        for obj in bucket.objects.filter( Prefix = self.__path ):

            # Get path and filenames of object
            print( obj.key)
            path, filename = os.path.split( obj.key )
            path += '/'
            print( "path: {0}, file: {1}".format( path, filename ) )

            # If filename is empty, that means we have to create directory
            if not filename:
                os.makedirs( path )
            
            # If filename is there, then we download that file
            if len( filename ) > 0:
                try:
                    s3.Bucket( self.__bucketName ).download_file( obj.key, obj.key )
                except botocore.exceptions.ClientError as e:
                    if e.response['Error']['Code'] == "404":
                        print("The object does not exist.")
                    else:
                        print( "An error encountered" )
                        return False
        return True


    def CollectFiles( self ):

        # Load files ( valid for Classification only )
        # Store code file name and move in one common directory
        for file in os.listdir( self.__path + 'Code/' ):
            path = self.__path + 'Code/' + file
            # Move file to proper folder
            shutil.move( path, '{0}/{1}'.format(self.__userName, file))
            self.__files['code'] =  file
        
        # Move Data files in one common directory
        for file in os.listdir( self.__path + 'Data/' ):
            path = self.__path + 'Data/' + file
            # Move file to proper folder
            shutil.move( path, '{0}/{1}'.format(self.__userName, file))

        # Store requirements file name and move in one common directory
        for file in os.listdir( self.__path + 'Requirements/' ):
            path = self.__path + 'Requirements/' + file
            # Move file to proper folder
            shutil.move( path, '{0}/{1}'.format(self.__userName, file))
            self.__files['requirements'] = file

        # Move Input file in one common directory
        for file in os.listdir( self.__path + 'Input/' ):
            path = self.__path + 'Input/' + file
            shutil.move( path, '{0}/{1}'.format(self.__userName, file))
        
        # Move Model file in one common directory
        for file in os.listdir( self.__path + 'Model/' ):
            path = self.__path + 'Model/' + file
            shutil.move( path, '{0}/{1}'.format(self.__userName, file) )


    # Creates a vritual envrionment and run all the required commands
    def CreateVirtualEnv( self ):
        self.__envName += self.__userName
        commands = { 'create': 'python3 -m venv {0}'.format( self.__envName ),
                    'activate': 'source {0}/bin/activate'.format( self.__envName ),
                    'install': 'pip3 install -r {0}/{1}'.format( self.__userName, self.__files['requirements'] ),
                    'run': 'python3 {0}/{1}'.format( self.__userName, self.__files['code'] ),
                    'deactivate': 'deactivate' }

        
        # for command in commands.values():
        #     print( command )

        # Create virtual env
        subprocess.call( commands['create'], shell=True )

        # Run all commands in virtual env
        myProcess = subprocess.Popen( '{0}; {1}; {2}'.format( commands['activate'], commands['install'], commands['deactivate'] ), shell=True, stdout = subprocess.PIPE, stderr=subprocess.PIPE )
        print( "Done" )
        
        [outStream, errStream] = myProcess.communicate()
        print( outStream )
        print( errStream )
        print( "got here" )
        myProcess.kill()


    # Delete all the local creation after task is over
    def Clean( self ):
        if os.path.exists( self.__userName + '/' ):
            shutil.rmtree( self.__userName + '/' )
        
        if os.path.exists( self.__envName ):
            shutil.rmtree( self.__envName )    



# Main function
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

    # Call only after task is completed
    j.Clean()
    
    
 
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
