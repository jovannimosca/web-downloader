#!/bin/bash

pkg_dir=$(git rev-parse --show-toplevel)
backend_dir="${pkg_dir}/backend"
frontend_dir="${pkg_dir}/frontend"

# Install application-wide dependencies
echo "Installing application-wide dependencies..."
apt-get update -y
apt-get install -y python3 python3-pip python3-venv nodejs npm apache2

# Install backend dependencies
echo "Installing backend dependencies..."
cd $backend_dir
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd $frontend_dir
npm install
npm run build
cp -r dist/* /var/www/html