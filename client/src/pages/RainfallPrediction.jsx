import { useState } from "react";
import { predictRainfall } from "../services/predictionService";
import "./RainfallPrediction.css";

function RainfallPrediction() {
    const [formData, setFormData] = useState({
        temperature: "",
        humidity: "",
        pressure: "",
        wind_speed: ""
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const data = await predictRainfall({
                temperature: Number(formData.temperature),
                humidity: Number(formData.humidity),
                pressure: Number(formData.pressure),
                wind_speed: Number(formData.wind_speed)
            });

            setResult(data.data);
        } catch (err) {
            console.error(err);
            setError("Unable to connect to prediction service.");
        } finally {
            setLoading(false);
        }
    };

    const getResultClass = () => {
        if (!result) return "";

        if (result.rainfall_probability >= 75) {
            return "high";
        }

        if (result.rainfall_probability >= 50) {
            return "medium";
        }

        return "low";
    };

    return (
        <div className="weather-page">

            {/* Navbar */}
            <nav className="navbar">
                <div className="logo">
                    🌦️ RainPredict
                </div>

                <div className="nav-links">
                    <span className="active">Prediction</span>
                    <span>Dashboard</span>
                    <span>Forecast</span>
                    <span>History</span>
                </div>
            </nav>

            {/* Main Content */}
            <main className="main-container">

                <section className="hero">
                    <div>
                        <p className="small-title">AI WEATHER INTELLIGENCE</p>

                        <h1>
                            Rainfall Prediction
                        </h1>

                        <p className="hero-text">
                            Enter current weather conditions and get an
                            AI-powered rainfall prediction.
                        </p>
                    </div>

                    <div className="hero-icon">
                        🌧️
                    </div>
                </section>

                <div className="content-grid">

                    {/* Input Card */}
                    <section className="prediction-card">

                        <div className="card-header">
                            <div>
                                <h2>Weather Parameters</h2>
                                <p>
                                    Enter the current atmospheric conditions
                                </p>
                            </div>

                            <span className="ai-badge">
                                AI
                            </span>
                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="input-grid">

                                <div className="input-group">
                                    <label>Temperature</label>

                                    <div className="input-wrapper">
                                        <span>🌡️</span>

                                        <input
                                            type="number"
                                            name="temperature"
                                            placeholder="28"
                                            value={formData.temperature}
                                            onChange={handleChange}
                                            required
                                        />

                                        <span>°C</span>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label>Humidity</label>

                                    <div className="input-wrapper">
                                        <span>💧</span>

                                        <input
                                            type="number"
                                            name="humidity"
                                            placeholder="80"
                                            min="0"
                                            max="100"
                                            value={formData.humidity}
                                            onChange={handleChange}
                                            required
                                        />

                                        <span>%</span>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label>Atmospheric Pressure</label>

                                    <div className="input-wrapper">
                                        <span>🌬️</span>

                                        <input
                                            type="number"
                                            name="pressure"
                                            placeholder="1012"
                                            value={formData.pressure}
                                            onChange={handleChange}
                                            required
                                        />

                                        <span>hPa</span>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label>Wind Speed</label>

                                    <div className="input-wrapper">
                                        <span>💨</span>

                                        <input
                                            type="number"
                                            name="wind_speed"
                                            placeholder="12"
                                            min="0"
                                            value={formData.wind_speed}
                                            onChange={handleChange}
                                            required
                                        />

                                        <span>km/h</span>
                                    </div>
                                </div>

                            </div>

                            <button
                                className="predict-button"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        Predict Rainfall
                                        <span>→</span>
                                    </>
                                )}
                            </button>

                        </form>

                        {error && (
                            <div className="error-message">
                                ⚠️ {error}
                            </div>
                        )}

                    </section>

                    {/* Result Card */}
                    <section className={`result-card ${getResultClass()}`}>

                        {!result ? (
                            <div className="empty-result">

                                <div className="result-icon">
                                    ☁️
                                </div>

                                <h2>Prediction Result</h2>

                                <p>
                                    Enter weather parameters and click
                                    <strong> Predict Rainfall </strong>
                                    to see the result.
                                </p>

                            </div>
                        ) : (
                            <div className="result-content">

                                <p className="result-label">
                                    PREDICTION RESULT
                                </p>

                                <div className="result-icon">
                                    {result.rainfall_probability >= 75
                                        ? "🌧️"
                                        : result.rainfall_probability >= 50
                                            ? "🌦️"
                                            : "☀️"}
                                </div>

                                <h2>
                                    {result.prediction}
                                </h2>

                                <div className="probability">
                                    <span>
                                        {result.rainfall_probability}%
                                    </span>

                                    <small>
                                        Rainfall Probability
                                    </small>
                                </div>

                                <div className="progress">
                                    <div
                                        className="progress-bar"
                                        style={{
                                            width: `${result.rainfall_probability}%`
                                        }}
                                    ></div>
                                </div>

                                <div className="result-details">

                                    <div>
                                        <span>🌡️</span>
                                        <p>
                                            <small>Temperature</small>
                                            <strong>
                                                {result.temperature}°C
                                            </strong>
                                        </p>
                                    </div>

                                    <div>
                                        <span>💧</span>
                                        <p>
                                            <small>Humidity</small>
                                            <strong>
                                                {result.humidity}%
                                            </strong>
                                        </p>
                                    </div>

                                    <div>
                                        <span>🌬️</span>
                                        <p>
                                            <small>Pressure</small>
                                            <strong>
                                                {result.pressure} hPa
                                            </strong>
                                        </p>
                                    </div>

                                    <div>
                                        <span>💨</span>
                                        <p>
                                            <small>Wind</small>
                                            <strong>
                                                {result.wind_speed} km/h
                                            </strong>
                                        </p>
                                    </div>

                                </div>

                            </div>
                        )}

                    </section>

                </div>

                {/* Bottom Info */}
                <section className="info-section">

                    <div>
                        <span>🤖</span>

                        <div>
                            <h3>AI-Powered Prediction</h3>
                            <p>
                                Weather parameters are analyzed to estimate
                                rainfall probability.
                            </p>
                        </div>
                    </div>

                    <div>
                        <span>⚡</span>

                        <div>
                            <h3>Fast Results</h3>
                            <p>
                                Get prediction results instantly through the
                                connected ML service.
                            </p>
                        </div>
                    </div>

                    <div>
                        <span>📊</span>

                        <div>
                            <h3>Data Insights</h3>
                            <p>
                                View important weather parameters alongside
                                your prediction.
                            </p>
                        </div>
                    </div>

                </section>

            </main>

        </div>
    );
}

export default RainfallPrediction;