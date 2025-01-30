#!/bin/bash
echo "Installing dependencies..."
cd frontend
npm install
echo "Building frontend..."
npm run build 