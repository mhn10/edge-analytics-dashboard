#######################################################
#   This script is intended to be run on Jetson TX2.  #
#   It will check S3 bucket for any new models        #
#   When a new model is found, it will download it    #
#   and run the model on Jetson TX2                   #
#######################################################

import subprocess
import os, time
import datetime as dt
#import pickledb
import sys

# Simple database to store available models and when they were last updated
#db = pickledb.load('models.db', False)
# outputFile = open('output.txt', 'a')
bucket_string = 's3://cmpe295-jetson-s3/'


# Sync S3 bucket object for models and delete model if its deleted from bucket
def syncS3ToJetson(uid,model_filename):
    source_filepath = bucket_string+'Models/'+uid+'/'+model_filename
    destination_filepath = './AWS/Models/'+uid
    print(source_filepath)
    print(destination_filepath)
    subprocess.call(['aws', 's3', 'cp', source_filepath, destination_filepath], stdout=True)

# Sync Result file from Jetson to S3 bucket
def syncJetsonToS3(uid,y):
    destination_filepath = bucket_string+'Results/'+uid+'/'
    #source_filepath = './AWS/Results/'+uid
    subprocess.call(['aws', 's3', 'cp', y, destination_filepath], stdout=True)


# Check if model is updated in jetson (for both new addition or deleteion)
def checkFolderForModel():
    # In Models folder we only check for any new model
    walkObj = os.walk('./AWS/Models/001')
    
    # Check if we have to run new model
    #ifHaveToRunModel = False
    
    objVals = []

    for val in walkObj:
        objVals.append(val)

    # print("object vals: ")
    # print(objVals)
    
    # Get existing model names
    #existingModels = db.getall()

    # All variables are divided in list of size 3
    # at index 0, its Root Directory
    # at index 1, its list of Sub-Directories
    # at index 2, are the list of files (models in our case)

    # check for updation or new edition
 

def runModelScript(uid,model_filename):
    return subprocess.Popen(['python3','pavan02.py',uid,model_filename], stdout = subprocess.PIPE)
    

def main():
    uid = sys.argv[1]
    model_filename = sys.argv[2]
    syncS3ToJetson(uid,model_filename)
    subprocess_result = runModelScript(uid,model_filename)
    x = subprocess_result.stdout.read().decode('ascii')
    print("subprocess returned this")
    print(x)
    y = x[:-1]
    print(y)
    print("blaa")
    syncJetsonToS3(uid,y)

if __name__ == "__main__":
    main()
