from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI(title="Weather Prediction API", description="API for predicting weather and rainfall in Sri Lanka")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Models (handling path depending on where the script is run)
model_path = "models"
if not os.path.exists(model_path):
    model_path = "../models"

try:
    rain_classifier = joblib.load(os.path.join(model_path, "rain_classifier.pkl"))
    temp_regressor = joblib.load(os.path.join(model_path, "temp_regressor.pkl"))
except Exception as e:
    print(f"Warning: Models not loaded. Please run src/train_and_export.py first. Error: {e}")
    rain_classifier = None
    temp_regressor = None

class WeatherInput(BaseModel):
    month: int
    max_temperature: float
    min_temperature: float
    rainfall: float
    max_wind_speed: float

@app.get("/")
def read_root():
    return {"message": "Welcome to the Sri Lanka Weather Prediction API!"}

@app.post("/predict")
def predict_weather(data: WeatherInput):
    if rain_classifier is None or temp_regressor is None:
        raise HTTPException(status_code=500, detail="Models are not loaded.")

    # Create a DataFrame for prediction
    input_data = pd.DataFrame([{
        "month": data.month,
        "max_temperature": data.max_temperature,
        "min_temperature": data.min_temperature,
        "rainfall": data.rainfall,
        "max_wind_speed": data.max_wind_speed
    }])

    # Predict Rain
    rain_pred = int(rain_classifier.predict(input_data)[0])
    rain_prob = float(rain_classifier.predict_proba(input_data)[0][1])

    # Predict Temperature
    temp_pred = float(temp_regressor.predict(input_data)[0])

    return {
        "will_rain_tomorrow": bool(rain_pred),
        "rain_probability": round(rain_prob, 2),
        "predicted_mean_temperature": round(temp_pred, 2)
    }
