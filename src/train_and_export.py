import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib
import os

def main():
    print("Loading data...")
    # Adjust path if running from src/ or root
    data_path = 'data/processed/kandy_weather_cleaned.csv'
    if not os.path.exists(data_path):
        data_path = '../data/processed/kandy_weather_cleaned.csv'
        
    df = pd.read_csv(data_path)
    
    # Select a user-friendly subset of features for the Web UI
    features = ['month', 'max_temperature', 'min_temperature', 'rainfall', 'max_wind_speed']
    
    # Targets
    y_class = df['rain_tomorrow']
    y_reg = df['mean_temperature']
    
    X = df[features]
    
    print("Training Logistic Regression (Classification) for rain_tomorrow...")
    # Create a pipeline with a scaler for Logistic Regression
    clf_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('logreg', LogisticRegression(random_state=42, class_weight='balanced'))
    ])
    clf_pipeline.fit(X, y_class)
    print(f"Logistic Regression Training Accuracy: {clf_pipeline.score(X, y_class):.4f}")
    
    print("Training Random Forest (Regression) for mean_temperature...")
    reg_model = RandomForestRegressor(n_estimators=100, random_state=42)
    reg_model.fit(X, y_reg)
    print(f"Random Forest Training R2: {reg_model.score(X, y_reg):.4f}")
    
    # Ensure models directory exists
    os.makedirs('models', exist_ok=True)
    if os.path.exists('../models'):
        model_dir = '../models'
    else:
        model_dir = 'models'
        
    # Export models
    print("Exporting models...")
    joblib.dump(clf_pipeline, os.path.join(model_dir, 'rain_classifier.pkl'))
    joblib.dump(reg_model, os.path.join(model_dir, 'temp_regressor.pkl'))
    print("Models successfully saved to 'models/' directory.")

if __name__ == '__main__':
    main()
