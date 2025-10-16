# Voice Chat Agent

This project is a voice chat agent with a Python/FastAPI backend and a React frontend.

## Getting Started

### Prerequisites

- **Node.js:** Version 20.0.0 or higher. We recommend using `nvm` (Node Version Manager) to manage Node.js versions.
- **Python:** Version 3.8 or higher.

---

## Backend Setup (Command-Line)

Follow these steps in your terminal to get the backend running.

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a Python virtual environment:**
    ```bash
    python3 -m venv venv
    ```

3.  **Activate the virtual environment:**
    -   **On Windows (PowerShell or cmd):**
        ```bash
        .\venv\Scripts\activate
        ```
    -   **On macOS and Linux:**
        ```bash
        source venv/bin/activate
        ```
    *You should see `(venv)` at the beginning of your terminal prompt.*

4.  **Install the required Python packages:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Run the backend server:**
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 8000
    ```
    The backend server is now running at `http://localhost:8000`.

---

## Frontend Setup (Command-Line)

Follow these steps in a **new, separate terminal** to get the frontend running.

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Set the correct Node.js version (if you use nvm):**
    ```bash
    nvm use
    ```

3.  **Install the required Node.js packages:**
    ```bash
    npm install
    ```

4.  **Run the frontend development server:**
    ```bash
    npm start
    ```
    The frontend application will open automatically in your browser at `http://localhost:3000`.