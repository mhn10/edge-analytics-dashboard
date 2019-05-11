# This code is called by Worker which then handle the complete task                                 #
# ans ends with replying with output file or error message to server                                #
#                                                                                                   #
# Author: Sahil Sharma                                                                              #
# Last Edited: May 2, 2019                                                                         #
#####################################################################################################
import s3
import boto3, botocore
import subprocess
import sys, os, shutil
import time
from collections import defaultdict
import logging
from botocore.exceptions import ClientError
import mqtt
import json
import requests

class Jetson:
    def __init__( self ):
        self.__bucketName = ''
        self.__files = defaultdict( )
        self.__userName = ''
        self.__actionName = ''
        self.__taskName = ''
        self.__path = ''

        self.__nodeID = requests.get( "http://localhost:4001/info" ).json()['Name']
        # print("CHECK: ", self.__nodeID )
        # Get the reouserce
        self.s3Obj = s3.S3()

        self.mqttObj = mqtt.MQTT()
        self.mqttObj.start()
        self.updateTopic = "Updates"

    
    def __deleteDirs( self, path ):
        if os.path.exists( path ):
            shutil.rmtree( path )
    

    # Set user name ,task name and action type
    def SetUser( self, user_name, action_name, task_name):
        self.__userName = user_name
        self.__actionName = action_name
        self.__taskName = task_name


    def downloadFiles( self, bucket_name ):
        res = self.s3Obj.getResource()

        self.__bucketName = bucket_name
        bucket = res.Bucket( bucket_name )
        # logging.debug( "Connected to bucket in S3." )

        # Set path
        self.__path = self.__userName + '/' + self.__actionName + '/' + self.__taskName + '/'
        # clean if something folder already exists
        # self.Clean()
        localtime = time.asctime( time.localtime( time.time() ) )
        msg = {"nodeID":self.__nodeID, "userName":self.__userName, "taskName":self.__taskName, "status": "Downloading files...", "time":localtime}
        self.mqttObj.publish( self.updateTopic, json.dumps( msg ), False )

        # Find objects that we want to download
        for obj in bucket.objects.filter( Prefix = self.__path ):

            # Get path and filenames of object
            # loggin.debug( obj.key )
            path, filename = os.path.split( obj.key )
            path += '/'
            print( "path: '{0}', file: '{1}'".format( path, filename ) )

            # If filename is empty, that means we have to create directory
            # if not filename:
            print("creating dir at ", path)
            if not os.path.exists( path ):
                os.makedirs( path )
            
            # If filename is there, then we download that file
            if len( filename ) > 0:
                try:
                    # self.s3.Bucket( self.__bucketName ).download_file( obj.key, obj.key )
                    bucket.download_file( obj.key, obj.key )
                except botocore.exceptions.ClientError as e:
                    if e.response['Error']['Code'] == "404":
                        print("The object does not exist.")
                    else:
                        print( "An error encountered" )
                        return False

        localtime = time.asctime( time.localtime( time.time() ) )
        msg = {"nodeID":self.__nodeID, "userName":self.__userName, "taskName":self.__taskName, "status":"Download complete", "time":localtime}
        self.mqttObj.publish( self.updateTopic, json.dumps( msg ), False )
        return True


    def CollectFiles( self ):

        # Load files ( valid for Classification only )
        # Store code file name and move in one common directory
        for file in os.listdir( self.__path + 'Code/' ):
            path = self.__path + 'Code/' + file
            # Move file to proper folder
            shutil.move( path, '{0}{1}'.format(self.__path, file))
            self.__files['code'] =  file
        
        # Move Data files in one common directory
        try:
            for file in os.listdir( self.__path + 'Data/' ):
                path = self.__path + 'Data/' + file
                # Move file to proper folder
                shutil.move( path, '{0}{1}'.format(self.__path, file))
        except Exception:
            pass

        # Store requirements file name and move in one common directory
        try:
            for file in os.listdir( self.__path + 'Requirements/' ):
                path = self.__path + 'Requirements/' + file
                # Move file to proper folder
                shutil.move( path, '{0}{1}'.format(self.__path, file))
                self.__files['requirements'] = file
        except Exception:
            pass

        # Move Input file in one common directory
        try:
            for file in os.listdir( self.__path + 'Input/' ):
                path = self.__path + 'Input/' + file
                shutil.move( path, '{0}{1}'.format(self.__path, file))
        except Exception:
            pass

        # Move Model file in one common directory
        try:
            for file in os.listdir( self.__path + 'Model/' ):
                path = self.__path + 'Model/' + file
                shutil.move( path, '{0}{1}'.format(self.__path, file) )
        except:
            pass

        # Create results folder
        if not os.path.exists( self.__path + "Results/" ):
            os.makedirs( '{0}Results/'.format( self.__path ) )
        print("Done with moving files")
        print( os.listdir( self.__userName + '/' ) )


    # Creates a vritual envrionment and run all the required commands
    def RunCode( self ):


        commands = {'install': 'pip3 install -r {0}'.format( self.__files['requirements'] ),
                    'run': 'python3 {0}'.format( self.__files['code'] ),
                    'changeDir': 'cd {0}'.format( self.__path ),
                    'backToDir': 'cd ~/Documents/Final/' }
        # print("RUN: ", self.__path)
        print( "Installing dependencies..." )
        print( "Check Node ID: ", self.__nodeID )
        localtime = time.asctime( time.localtime( time.time() ) )
        msg = {"nodeID":self.__nodeID, "userName":self.__userName, "taskName":self.__taskName, "status":"Installing dependencies....", "time":localtime}
        # msg = ""
        self.mqttObj.publish( self.updateTopic, json.dumps( msg ), True )
        #subprocess.call(commands['install'], shell=True)
        subprocess.call( "{0}; {1}".format( commands['changeDir'], commands['install'] ), shell=True)
        
        print( "Dependencies successfully installed.")
        localtime = time.asctime( time.localtime( time.time() ) )
        msg = {"nodeID":self.__nodeID, "userName":self.__userName, "taskName":self.__taskName, "status":"Dependencies successfully installed", "time":localtime }
        self.mqttObj.publish( self.updateTopic, json.dumps( msg ), False )

        


        #subprocess.call( commands['changeDir'], shell=True )
        print( "Process started..." )
        localtime = time.asctime( time.localtime( time.time() ) )
        msg = {"nodeID":self.__nodeID, "userName":self.__userName, "taskName":self.__taskName, "status":"Task started" , "time":localtime}
        self.mqttObj.publish( self.updateTopic, json.dumps( msg ), False )

        #subprocess.call( commands['run'], shell=True )
        subprocess.call( "{0}; {1}".format( commands['changeDir'], commands['run'] ), shell=True )
        
        print( "Process completed..." )
        localtime = time.asctime( time.localtime( time.time() ) )
        msg = {"nodeID":self.__nodeID, "userName":self.__userName, "taskName":self.__taskName, "status":"Task Completed.", "time": localtime }
        self.mqttObj.publish( self.updateTopic, json.dumps( msg ),False )

        #subprocess.call( commands['backToDir'], shell=True )

        # Task is completed

        # msg = {"userName":self.__userName, "taskName":self.__taskName, "msg":"Uploading result file...." }
        # self.mqttObj.publish( self.updateTopic, json.dumps( msg ), False )

        self.__uploadResultFile( )
        localtime = time.asctime( time.localtime( time.time() ) )
        msg = {"nodeID":self.__nodeID, "userName":self.__userName, "taskName":self.__taskName, "status":"Done", "time":localtime}
        self.mqttObj.publish( self.updateTopic, json.dumps( msg ), True )
        
        


    def __uploadResultFile( self ):
        client = self.s3Obj.getClient()
        for file in os.listdir( '{0}Results/'.format( self.__path ) ):
            obj = "{0}Results/{1}".format( self.__path, file )
            print( "DEBUG: ", file )
            print( "DEBUG: ", obj )
            try:

                response = client.upload_file( "{0}Results/{1}".format( self.__path, file ), self.__bucketName, obj, ExtraArgs={'ACL':'public-read'} )
            except ClientError as e:
                logging.error( e )
        print( "upload complete" )
        localtime = time.asctime( time.localtime( time.time() ) )
        msg = {"nodeID":self.__nodeID, "userName":self.__userName, "taskName":self.__taskName, "status":"Results uploaded", "time":localtime }
        self.mqttObj.publish( self.updateTopic, json.dumps( msg ), False )
        


    # Delete all the local creation after task is over
    def Clean( self ):
        if os.path.exists( self.__path ):
            shutil.rmtree( self.__path )
        
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

    j.downloadFiles( 'edge-vision-analytics' )
    j.CollectFiles()
    j.RunCode()

    # Call only after task is completed
    # j.Clean()
    
    
 
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

# {"userName": "kaikai", "isCamera": "false", "actionType": "Classification", "taskName": "task7", "nodeId": "Jetson"}
