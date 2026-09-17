from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Rainfall ML Service is running"
    })


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    temperature = data.get("temperature")
    humidity = data.get("humidity")
    pressure = data.get("pressure")
    wind_speed = data.get("wind_speed")

    # Temporary prediction logic
    # Actual trained ML model will be connected later.
    if humidity >= 75:
        rainfall_probability = 80
        prediction = "High chance of rainfall"
    elif humidity >= 50:
        rainfall_probability = 50
        prediction = "Moderate chance of rainfall"
    else:
        rainfall_probability = 20
        prediction = "Low chance of rainfall"

    return jsonify({
        "temperature": temperature,
        "humidity": humidity,
        "pressure": pressure,
        "wind_speed": wind_speed,
        "rainfall_probability": rainfall_probability,
        "prediction": prediction
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)