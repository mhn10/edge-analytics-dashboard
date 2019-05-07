# !/bin/sh

echo "Intializing..."

echo "Installing dependencies..."
echo "Do you want to continue? [Y/N]"
read response

if [ "$response" != "Y" ] && [ "$response" != "y" ]
then
    echo "Installation declined"
    echo "Skipping..."
else
    pip3 install -r requirements.txt --user
fi


mkdir --parents $HOME/go
go get

echo "Provide name for your cluster and press [ENTER]:"
read node_name

echo "Enter your public address for connection with cluster and press [ENTER]:"
read node_ip

echo "Joining cluster? Enter member's IP"
echo "If there are more than one members you are joining, \nenter comma separated values without space"
echo "If not, leave empty"
read members

if [ -z "$members" ]; then
        go run cluster.go --name=$node_name --ip=$node_ip &
else
        go run cluster.go --name=$node_name --ip=$node_ip --members=$members:7946 &
fi

sleep 2
python3 nodeComm.py &
python3 worker.py &