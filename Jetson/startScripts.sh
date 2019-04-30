# !/bin/sh

echo "Intializing..."

echo "Installing dependencies..."
echo "Installing Golang.."
echo "Do you want to continue? [Y/N]"
read response

if [ "$response" != "Y" ] && [ "$response" != "y" ]; then
    echo "Installation declined"
    echo "Exiting..."
    exit 1
fi

sudo apt-get update
sudo apt-get install golang-go

echo "Installing pip3..."
echo "Do you want to continue? [Y/N]"
read response

if [ "$response" != "Y" ] && [ "$response" != "y" ]; then
    echo "Installation declined"
    echo "Exiting..."
    exit 1
fi

echo "Installing other dependencies..."
echo "Do you want to continue? [Y/N]"
read response

if [ "$response" != "Y" ] && [ "$response" != "y" ]; then
    echo "Installation declined"
    echo "Exiting..."
    exit 1
fi

pip3 install -r requirements.txt

mkdir --parents $HOME/go
go get

echo "Provide name for your cluster and press [ENTER]:"
read node_name

echo "Enter your public address for connection with cluster and press [ENTER]:"
read node_ip

go run cluster.go --name=$node_name --ip=$node_ip &



sudo apt-install python3-pip

ping -c 1 $node_addr &>/dev/null ; a=$?
if [ "$a" != "0" ]; then
    echo "Chekc IP"
    exit 1
fi

echo "Enter node port and press [ENTER]: "
read node_port

python3 nodeComm.py &
python3 worker.py &