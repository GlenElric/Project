#!/bin/bash
echo "Activating virtual environment..."
source backend/venv/bin/activate
echo "Starting backend server..."
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
echo "Deactivating virtual environment..."
deactivate