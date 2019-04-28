# !/bin/sh

echo "Intializing..."

echo "Enter node address and press [ENTER]: "
read node_addr

ping -c 1 $node_addr &>/dev/null ; a=$?
if [ "$a" != "0" ]; then
    echo "Chekc IP"
    exit 1
fi

echo "Enter node port and press [ENTER]: "
read node_port

python3 mqtt_pub.py node_addr=$node_addr node_port=$node_port &
python3 worker.py &