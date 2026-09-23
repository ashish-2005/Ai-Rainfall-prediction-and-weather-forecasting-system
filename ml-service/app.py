from flask import Flask, request, jsonify
import joblib
import pandas as pd
import os

app = Flask(__name__)

# =========================================================
# Configuration
# =========================================================

PORT = 5001

FEATURES = [
    "avg_temp",
    "min_temp",
    "max_temp",
    "wind_speed",
    "air_pressure",
    "elevation",
    "latitude",
    "longitude"
]

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "models",
    "rainfall_model.pkl"
)


# =========================================================
# Load trained model
# =========================================================

try:
    model = joblib.load(MODEL_PATH)
    print("Rainfall model loaded successfully!")

except Exception as e:
    model = None
    print(f"Failed to load rainfall model: {e}")


# =========================================================
# Home
# =========================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "success": True,
        "message": "AI Rainfall Prediction ML Service is running",
        "model_loaded": model is not None
    })


# =========================================================
# Health Check
# =========================================================

@app.route("/health", methods=["GET"])
def health():

    if model is None:
        return jsonify({
            "success": False,
            "status": "unhealthy",
            "message": "ML model is not loaded"
        }), 500

    return jsonify({
        "success": True,
        "status": "healthy",
        "message": "ML service is ready"
    })


# =========================================================
# Prediction
# =========================================================

@app.route("/predict", methods=["POST"])
def predict():

    if model is None:
        return jsonify({
            "success": False,
            "error": "ML model is not available"
        }), 500

    if not request.is_json:
        return jsonify({
            "success": False,
            "error": "Request must contain JSON data"
        }), 400

    try:

        data = request.get_json()

        # Check required features
        missing_features = [
            feature
            for feature in FEATURES
            if feature not in data
        ]

        if missing_features:

            return jsonify({
                "success": False,
                "error": "Missing required features",
                "missing_features": missing_features
            }), 400

        # Convert values to numbers
        input_values = {}

        for feature in FEATURES:

            try:
                value = float(data[feature])

            except (TypeError, ValueError):

                return jsonify({
                    "success": False,
                    "error": f"{feature} must be a numeric value"
                }), 400

            if pd.isna(value):

                return jsonify({
                    "success": False,
                    "error": f"{feature} cannot be null"
                }), 400

            input_values[feature] = value

        # Create DataFrame
        input_data = pd.DataFrame(
            [input_values],
            columns=FEATURES
        )

        # Make prediction
        prediction = model.predict(input_data)[0]

        # Rainfall cannot be negative
        prediction = max(0.0, float(prediction))

        # Rainfall category
        if prediction == 0:
            category = "No Rainfall"

        elif prediction < 2.5:
            category = "Very Light Rain"

        elif prediction < 7.5:
            category = "Light Rain"

        elif prediction < 35:
            category = "Moderate Rain"

        elif prediction < 65:
            category = "Heavy Rain"

        else:
            category = "Very Heavy Rain"

        return jsonify({

            "success": True,

            "prediction": {
                "rainfall": round(prediction, 2),
                "unit": "mm",
                "category": category
            },

            "input": input_values

        }), 200

    except Exception as e:

        print("Prediction error:", e)

        return jsonify({
            "success": False,
            "error": "Prediction failed",
            "details": str(e)
        }), 500


# =========================================================
# Start Flask Server
# =========================================================

if __name__ == "__main__":

    print("\n======================================")
    print(" AI Rainfall Prediction ML Service")
    print("======================================")
    print(f"Model: {MODEL_PATH}")
    print(f"Port : {PORT}")
    print("======================================\n")

    app.run(
        host="0.0.0.0",
        port=PORT,
        debug=False
    )