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


# Downlaod Model from S3 bucket with given name and uid
def downloadFromS3(uid,modelFilename):
    source_filepath = bucket_string+'Models/'+uid+'/'+modelFilename
    destination_filepath = './AWS/Models/'+uid
    # print("DownloadS3 source: {}".format(source_filepath))
    # print("DownloadS3 dest: {}".format(destination_filepath))
    subprocess.call(['aws', 's3', 'cp', source_filepath, destination_filepath], stdout=True)

# Sync Result file from Jetson to S3 bucket
def uploadToS3(uid,outputFile):
    destination_filepath = bucket_string+'Results/'+uid+'/'
    output_filepath = './AWS/Results/'+uid+'/'+outputFile
    # print("uploadS3: {}".format(output_filepath))
    #source_filepath = './AWS/Results/'+uid
    subprocess.call(['aws', 's3', 'cp', output_filepath, destination_filepath], stdout=True)


# Check if model is updated in jetson (for both new addition or deleteion)
def checkFolderForModel(uid):
    # In Models folder we only check for any new model
    # walkObj = os.walk('./AWS/Models/')
    #uid = "002"
    walkObj1 = next(os.walk('./AWS/Models/'))[1]
    walkObj2 = next(os.walk('./AWS/Results/'))[1]
    # Check if we have to run new model
    #ifHaveToRunModel = False
    print(type(walkObj1))
    
    #objVals = []

    #for val in walkObj:
    #    objVals.append(val)

    #print("object vals: ")
    #print(objVals)
    if uid not in walkObj1 or uid  not in walkObj2:
        model_directory = './AWS/Models/'+uid
        result_directory = './AWS/Results/'+uid
        # print("new dir: ", directory)
        subprocess.check_call(['mkdir', model_directory])
        subprocess.check_call(['mkdir', result_directory])
        
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
    # Store arguments
    # print("got checkS3")
    uid = sys.argv[1]
    model_filename = sys.argv[2]
    modelType = sys.argv[3]
    dataFile = sys.argv[4]
    checkFolderForModel(uid)
    # Lets download model of user uid from S3
    downloadFromS3(uid,model_filename)
    # print("download done")
    # Get result (output filename) from running script
    subprocess_result = runModelScript(uid,model_filename)
    outputFilename = subprocess_result.stdout.read().decode('ascii')
    # print("subprocess returned this")
    # print(x)
    outputFile = outputFilename[:-1]
    # print("Outout file: {}".format(outputFile))
    # print("blaa")
    uploadToS3(uid,outputFile)
    # Now reply to server
    subprocess.call(['python3', 'Response.py',outputFile])

if __name__ == "__main__":
    main()
