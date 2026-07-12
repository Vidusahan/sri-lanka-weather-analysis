# Sri Lanka Weather Prediction - Full Stack Portfolio Project

This project leverages Machine Learning to predict weather patterns in Sri Lanka, wrapped in a modern, premium full-stack web application.

## Architecture

The project has been structured into distinct components for scalability and clarity:

- **Frontend (`frontend/`)**: A sleek, interactive Web UI built with **Vite + React**. Features glassmorphic design, smooth animations, and interactive charts (Recharts) to showcase descriptive analysis and allow users to run predictions in real-time.
- **Backend (`backend/`)**: A fast, asynchronous API built with **FastAPI**. It loads pre-trained machine learning models and serves predictions via the `/predict` endpoint.
- **Models (`models/`)**: Contains the exported `.pkl` machine learning models (Logistic Regression for classification, Random Forest for regression).
- **Machine Learning Pipelines (`src/`, `notebooks/`)**: The original Jupyter notebooks containing exploratory data analysis (EDA), descriptive analysis, and inferential analysis, alongside the new `src/train_and_export.py` script used to generate the production models.

## Setup Instructions

### 1. Backend Setup

1. Create a virtual environment and activate it:
   ```bash
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI server:
   ```bash
   uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
   ```
   The API will be available at `http://localhost:8000`. You can view the interactive API docs at `http://localhost:8000/docs`.

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The Web UI will be available at `http://localhost:5173`.

## Features
- **Dual-Model Prediction Engine**: Predicts *whether it will rain* (Logistic Regression, ~84.6% accuracy) and the *expected temperature* (Random Forest Regression, ~0.72 R2).
- **Data Visualization Dashboard**: Visualizes historical rainfall averages and temperature trends over the years.
- **Modern UI/UX**: Built with React and Vanilla CSS for a lightweight, extremely responsive, and visually stunning user experience.