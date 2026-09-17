import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from xgboost import XGBRegressor

from preprocessing import load_data, preprocess_data


# Dataset path
FILE_PATH = "../data/dataset/india_weather_rainfall_data.xlsx"

# Load dataset
df = load_data(FILE_PATH)

# Preprocess
X, y = preprocess_data(df)

print("\n===== SPLITTING DATA =====")

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("Training samples:", len(X_train))
print("Testing samples:", len(X_test))


# Create model
print("\n===== TRAINING XGBOOST =====")

model = XGBRegressor(
    n_estimators=300,
    max_depth=8,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="reg:squarederror",
    random_state=42,
    n_jobs=-1
)

# Train
model.fit(X_train, y_train)

print("Training completed!")


# Prediction
print("\n===== EVALUATION =====")

y_pred = model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
rmse = mean_squared_error(y_test, y_pred) ** 0.5
r2 = r2_score(y_test, y_pred)

print(f"MAE  : {mae:.4f}")
print(f"RMSE : {rmse:.4f}")
print(f"R2   : {r2:.4f}")


# Save model
MODEL_DIR = "../models"
os.makedirs(MODEL_DIR, exist_ok=True)

MODEL_PATH = os.path.join(MODEL_DIR, "rainfall_model.pkl")

joblib.dump(model, MODEL_PATH)

print("\n===== MODEL SAVED =====")
print(f"Model saved at: {MODEL_PATH}")