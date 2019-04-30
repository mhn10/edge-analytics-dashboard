import sqs
import subprocess
import sys, time, os
import json


def main():
    sqsObj = sqs.SQS()
    queue = sqsObj.getTaskQueue()
    print("[DEBUG]: Connected to queue")

    while True:
        # Process messages by printing out body and optional author name
        for message in queue.receive_messages():

            js = json.loads(message.body)

            # Print out body and author
            print('Task: {0} '.format( js ) )
            try:
                subprocess.Popen( [ 'python3', 'bucket.py', js['userName'], js['actionType'], js['taskName'] ] )
            except:
                print("ERROR: In Worker")
                sys.exit(1)

            # Let the queue know that the message is processed
            message.delete()

if __name__=='__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
