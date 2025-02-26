#!/bin/bash

PID_FILE="/tmp/web-downloader.pid"

if [[ ! -f $PID_FILE ]]; then
   echo "Web downloader is not running!"
   return 1
fi

PID=$(cat $PID_FILE)
kill -2 $PID
rm $PID_FILE
echo "Web downloader stopped"