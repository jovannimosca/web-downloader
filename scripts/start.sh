#!/bin/bash
set -e

PID_FILE = "/tmp/web-downloader.pid"
pkg_dir=$(git rev-parse --show-toplevel)
backend_dir="${pkg_dir}/backend"
frontend_dir="${pkg_dir}/frontend"

# Start the frontend
echo "Starting the frontend..."
cd $frontend_dir
systemctl start apache2

# Start the backend
echo "Starting the backend..."
cd $backend_dir
source .venv/bin/activate
uvicorn app:app --host 0.0.0.0 --port 8080 --workers 4 > $backend_dir/backend.log 2>&1 &

echo $! > $PID_FILE
echo "Web downloader started with PID: $(cat $PID_FILE)"