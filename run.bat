@echo off
echo "Activating virtual environment..."
call backend\venv\Scripts\activate
echo "Starting backend server..."
cd backend
start "Backend Server" uvicorn main:app --host 0.0.0.0 --port 8000
echo "Backend server started. Press Ctrl+C in the new window to stop."
pause
call backend\venv\Scripts\deactivate