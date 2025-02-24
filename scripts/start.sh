#!/bin/bash

pkg_dir=$(git rev-parse --show-toplevel)
backend_dir="${pkg_dir}/backend"
frontend_dir="${pkg_dir}/frontend"

# Start the backend
echo "Starting the backend..."
cd $backend_dir
source .venv/bin/activate
uvicorn app:app --host 0.0.0.0 --port 8080 --workers 4

# Start the frontend
echo "Starting the frontend..."
cd $frontend_dir
systemctl start apache2