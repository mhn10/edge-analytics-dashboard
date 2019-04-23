#####################
README for Code Deployed on Jetson
    written by- Sahil Sharma
#####################

=================================
How things will work in Jetson
=================================
1. There will be a Worker always running on Jetson waiting for any task to arrive.
2. When a task is arrived, Worker will start another script that will download files from S3 and create similar folder structrure
3. After that Jetson will create a virtual environment and install dependencies in that.
4. Later, the code will be run.