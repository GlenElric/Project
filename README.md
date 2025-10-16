# Voice Chat Agent

This project is a voice chat agent with a Python/FastAPI backend and a React frontend.

## Getting Started

### Prerequisites

- **Node.js:** Version 20.0.0 or higher. Use `nvm` to manage Node.js versions.
- **Python:** Version 3.8 or higher.

### Backend Setup

1.  **Create the virtual environment:**
    -   Navigate to the `backend` directory:
        ```bash
        cd backend
        ```
    -   Run the script to create the virtual environment and install dependencies:
        ```bash
        ./create_venv.sh
        ```

2.  **Run the backend server:**
    -   From the root directory, run the appropriate script for your operating system:
        -   **Linux/macOS:**
            ```bash
            ./run.sh
            ```
        -   **Windows:**
            ```bat
            run.bat
            ```
    -   The backend server will be running at `http://localhost:8000`.

### Frontend Setup

1.  **Install dependencies:**
    -   Navigate to the `frontend` directory:
        ```bash
        cd frontend
        ```
    -   Install the required Node.js packages:
        ```bash
        npm install
        ```

2.  **Run the frontend development server:**
    -   From the `frontend` directory, run:
        ```bash
        npm start
        ```
    -   The frontend application will be available at `http://localhost:3000`.