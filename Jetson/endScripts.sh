# !/bin/sh

kill `pidof go run cluster`
pkill -f "python3 nodeComm.py"

# pkill -f "python3 worker.py"