import { useEffect, useState } from "react";
import { predictRainfall } from "../services/predictionService";
import "./RainfallPrediction.css";

function RainfallPrediction() {
    const [formData, setFormData] = useState({
        avg_temp: "",
        min_temp: "",
        max_temp: "",
        wind_speed: "",
        air_pressure: "",
        elevation: "",
        latitude: "",
        longitude: ""
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Location states
    const [location, setLocation] = useState("");
    const [locationResults, setLocationResults] = useState([]);
    const [locationLoading, setLocationLoading] = useState(false);

    // Prediction history
    const [history, setHistory] = useState(() => {
        try {
            return JSON.parse(
                localStorage.getItem("rainfallHistory")
            ) || [];
        } catch {
            return [];
        }
    });


    /* =========================
       INPUT CHANGE
    ========================= */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    /* =========================
       LOCATION SEARCH
    ========================= */

    const searchLocation = async () => {
        if (!location.trim()) {
            return;
        }

        setLocationLoading(true);
        setLocationResults([]);
        setError("");

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
                    location
                )}`
            );

            if (!response.ok) {
                throw new Error("Location search failed");
            }

            const data = await response.json();

            if (data.length === 0) {
                setError("Location not found. Try another city.");
            } else {
                setLocationResults(data);
            }

        } catch (err) {
            console.error(err);
            setError("Unable to search location.");
        } finally {
            setLocationLoading(false);
        }
    };


    /* =========================
       SELECT LOCATION
    ========================= */

    const selectLocation = (place) => {
        setLocation(place.display_name);

        setFormData((prev) => ({
            ...prev,
            latitude: Number(place.lat).toFixed(4),
            longitude: Number(place.lon).toFixed(4)
        }));

        setLocationResults([]);
    };


    /* =========================
       PREDICTION
    ========================= */

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const data = await predictRainfall({
                avg_temp: Number(formData.avg_temp),
                min_temp: Number(formData.min_temp),
                max_temp: Number(formData.max_temp),
                wind_speed: Number(formData.wind_speed),
                air_pressure: Number(formData.air_pressure),
                elevation: Number(formData.elevation),
                latitude: Number(formData.latitude),
                longitude: Number(formData.longitude)
            });

            if (!data.success) {
                throw new Error(
                    data.error || "Prediction failed"
                );
            }

            const prediction = data.prediction;

            setResult(prediction);


            /* Save prediction history */

            const historyItem = {
                id: Date.now(),

                date: new Date().toLocaleString(),

                location: location || "Custom Location",

                latitude: formData.latitude,
                longitude: formData.longitude,

                rainfall: prediction.rainfall,

                unit: prediction.unit,

                category: prediction.category
            };


            const updatedHistory = [
                historyItem,
                ...history
            ].slice(0, 10);

            setHistory(updatedHistory);

            localStorage.setItem(
                "rainfallHistory",
                JSON.stringify(updatedHistory)
            );

        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Unable to get rainfall prediction."
            );
        } finally {
            setLoading(false);
        }
    };


    /* =========================
       DELETE HISTORY
    ========================= */

    const clearHistory = () => {
        setHistory([]);

        localStorage.removeItem(
            "rainfallHistory"
        );
    };


    /* =========================
       RESET
    ========================= */

    const resetForm = () => {
        setFormData({
            avg_temp: "",
            min_temp: "",
            max_temp: "",
            wind_speed: "",
            air_pressure: "",
            elevation: "",
            latitude: "",
            longitude: ""
        });

        setLocation("");
        setLocationResults([]);
        setResult(null);
        setError("");
    };


    /* =========================
       RESULT STYLE
    ========================= */

    const getCategoryClass = () => {
        if (!result) return "";

        const category =
            result.category?.toLowerCase();

        if (category?.includes("very heavy"))
            return "very-heavy";

        if (category?.includes("heavy"))
            return "heavy";

        if (category?.includes("moderate"))
            return "moderate";

        if (category?.includes("light"))
            return "light";

        if (category?.includes("no rainfall"))
            return "none";

        return "";
    };


    const getCategoryIcon = () => {
        if (!result) return "☁️";

        const category =
            result.category?.toLowerCase();

        if (category?.includes("very heavy"))
            return "⛈️";

        if (category?.includes("heavy"))
            return "🌧️";

        if (category?.includes("moderate"))
            return "🌦️";

        if (category?.includes("light"))
            return "🌦️";

        if (category?.includes("no rainfall"))
            return "☀️";

        return "🌧️";
    };


    const rainfallValue = result
        ? Math.min(
              Number(result.rainfall) || 0,
              100
          )
        : 0;


    return (
        <div className="rain-page">

            {/* =========================
                NAVBAR
            ========================= */}

            <header className="topbar">

                <div className="brand">

                    <div className="brand-icon">
                        🌧️
                    </div>

                    <div>
                        <h2>
                            RainPredict AI
                        </h2>

                        <span>
                            Weather Intelligence
                        </span>
                    </div>

                </div>

                <div className="status">

                    <span className="status-dot"></span>

                    ML Model Online

                </div>

            </header>


            <main className="rain-container">


                {/* =========================
                    HERO
                ========================= */}

                <section className="hero-section">

                    <div className="hero-content">

                        <div className="eyebrow">
                            ✦ AI WEATHER INTELLIGENCE
                        </div>

                        <h1>
                            Predict Rainfall
                            <span> with AI</span>
                        </h1>

                        <p>
                            Enter atmospheric and geographic
                            conditions to estimate rainfall
                            using our trained machine learning
                            model.
                        </p>

                        <div className="hero-stats">

                            <div>
                                <strong>8</strong>
                                <span>
                                    Input Features
                                </span>
                            </div>

                            <div>
                                <strong>
                                    XGBoost
                                </strong>
                                <span>
                                    ML Algorithm
                                </span>
                            </div>

                            <div>
                                <strong>mm</strong>
                                <span>
                                    Prediction Unit
                                </span>
                            </div>

                        </div>

                    </div>

                    <div className="hero-visual">

                        <div className="weather-orb">
                            🌧️
                        </div>

                    </div>

                </section>


                {/* =========================
                    LOCATION SEARCH
                ========================= */}

                <section className="location-card">

                    <div className="location-heading">

                        <div className="location-icon">
                            📍
                        </div>

                        <div>
                            <h2>
                                Search Location
                            </h2>

                            <p>
                                Find a city to automatically
                                get its coordinates.
                            </p>
                        </div>

                    </div>


                    <div className="location-search">

                        <input
                            type="text"
                            placeholder="Search city, district or place..."
                            value={location}
                            onChange={(e) =>
                                setLocation(
                                    e.target.value
                                )
                            }
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Enter"
                                ) {
                                    searchLocation();
                                }
                            }}
                        />

                        <button
                            type="button"
                            onClick={searchLocation}
                            disabled={
                                locationLoading
                            }
                        >
                            {locationLoading
                                ? "Searching..."
                                : "Search"}
                        </button>

                    </div>


                    {/* Search results */}

                    {locationResults.length > 0 && (

                        <div className="location-results">

                            {locationResults.map(
                                (place) => (

                                    <button
                                        type="button"
                                        key={place.place_id}
                                        onClick={() =>
                                            selectLocation(
                                                place
                                            )
                                        }
                                    >

                                        <span>
                                            📍
                                        </span>

                                        <div>
                                            <strong>
                                                {
                                                    place.name
                                                }
                                            </strong>

                                            <small>
                                                {
                                                    place.display_name
                                                }
                                            </small>
                                        </div>

                                    </button>

                                )
                            )}

                        </div>

                    )}


                    {location && (
                        <div className="coordinates">

                            <span>
                                Latitude:
                                <strong>
                                    {formData.latitude ||
                                        "--"}
                                </strong>
                            </span>

                            <span>
                                Longitude:
                                <strong>
                                    {formData.longitude ||
                                        "--"}
                                </strong>
                            </span>

                        </div>
                    )}

                </section>


                {/* =========================
                    MAIN DASHBOARD
                ========================= */}

                <section className="dashboard-grid">


                    {/* INPUT CARD */}

                    <div className="weather-card input-card">

                        <div className="card-top">

                            <div>

                                <span className="card-label">
                                    WEATHER INPUT
                                </span>

                                <h2>
                                    Atmospheric Conditions
                                </h2>

                                <p>
                                    Provide current weather
                                    parameters
                                </p>

                            </div>

                            <div className="card-number">
                                01
                            </div>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                        >

                            <div className="fields-grid">


                                {/* Average temperature */}

                                <div className="field">

                                    <label>
                                        Average Temperature
                                    </label>

                                    <div className="field-input">

                                        <span>
                                            🌡️
                                        </span>

                                        <input
                                            type="number"
                                            step="any"
                                            name="avg_temp"
                                            placeholder="25"
                                            value={
                                                formData.avg_temp
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                        <span className="unit">
                                            °C
                                        </span>

                                    </div>

                                </div>


                                {/* Minimum */}

                                <div className="field">

                                    <label>
                                        Minimum Temperature
                                    </label>

                                    <div className="field-input">

                                        <span>
                                            ❄️
                                        </span>

                                        <input
                                            type="number"
                                            step="any"
                                            name="min_temp"
                                            placeholder="20"
                                            value={
                                                formData.min_temp
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                        <span className="unit">
                                            °C
                                        </span>

                                    </div>

                                </div>


                                {/* Maximum */}

                                <div className="field">

                                    <label>
                                        Maximum Temperature
                                    </label>

                                    <div className="field-input">

                                        <span>
                                            🔥
                                        </span>

                                        <input
                                            type="number"
                                            step="any"
                                            name="max_temp"
                                            placeholder="30"
                                            value={
                                                formData.max_temp
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                        <span className="unit">
                                            °C
                                        </span>

                                    </div>

                                </div>


                                {/* Wind */}

                                <div className="field">

                                    <label>
                                        Wind Speed
                                    </label>

                                    <div className="field-input">

                                        <span>
                                            💨
                                        </span>

                                        <input
                                            type="number"
                                            step="any"
                                            min="0"
                                            name="wind_speed"
                                            placeholder="5"
                                            value={
                                                formData.wind_speed
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                        <span className="unit">
                                            m/s
                                        </span>

                                    </div>

                                </div>


                                {/* Pressure */}

                                <div className="field">

                                    <label>
                                        Air Pressure
                                    </label>

                                    <div className="field-input">

                                        <span>
                                            🌬️
                                        </span>

                                        <input
                                            type="number"
                                            step="any"
                                            name="air_pressure"
                                            placeholder="1010"
                                            value={
                                                formData.air_pressure
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                        <span className="unit">
                                            hPa
                                        </span>

                                    </div>

                                </div>


                                {/* Elevation */}

                                <div className="field">

                                    <label>
                                        Elevation
                                    </label>

                                    <div className="field-input">

                                        <span>
                                            ⛰️
                                        </span>

                                        <input
                                            type="number"
                                            step="any"
                                            name="elevation"
                                            placeholder="100"
                                            value={
                                                formData.elevation
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                        <span className="unit">
                                            m
                                        </span>

                                    </div>

                                </div>


                                {/* Latitude */}

                                <div className="field">

                                    <label>
                                        Latitude
                                    </label>

                                    <div className="field-input">

                                        <span>
                                            📍
                                        </span>

                                        <input
                                            type="number"
                                            step="any"
                                            name="latitude"
                                            placeholder="28.61"
                                            value={
                                                formData.latitude
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                        <span className="unit">
                                            °
                                        </span>

                                    </div>

                                </div>


                                {/* Longitude */}

                                <div className="field">

                                    <label>
                                        Longitude
                                    </label>

                                    <div className="field-input">

                                        <span>
                                            📍
                                        </span>

                                        <input
                                            type="number"
                                            step="any"
                                            name="longitude"
                                            placeholder="77.20"
                                            value={
                                                formData.longitude
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                        <span className="unit">
                                            °
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* Error */}

                            {error && (

                                <div className="error-box">

                                    ⚠️

                                    <div>
                                        <strong>
                                            Error
                                        </strong>

                                        <p>
                                            {error}
                                        </p>
                                    </div>

                                </div>

                            )}


                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="reset-button"
                                    onClick={resetForm}
                                >
                                    Reset
                                </button>

                                <button
                                    type="submit"
                                    className="predict-button"
                                    disabled={loading}
                                >

                                    {loading ? (
                                        <>
                                            <span className="spinner"></span>
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            ✦
                                            Predict Rainfall
                                            →
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>


                    {/* RESULT CARD */}

                    <div
                        className={`weather-card result-card ${getCategoryClass()}`}
                    >

                        <div className="card-top">

                            <div>

                                <span className="card-label">
                                    AI PREDICTION
                                </span>

                                <h2>
                                    Rainfall Analysis
                                </h2>

                                <p>
                                    Machine learning result
                                </p>

                            </div>

                            <div className="card-number">
                                02
                            </div>

                        </div>


                        {!result ? (

                            <div className="empty-state">

                                <div className="empty-icon">
                                    ✦
                                </div>

                                <h3>
                                    Waiting for prediction
                                </h3>

                                <p>
                                    Enter weather parameters
                                    and run the AI model.
                                </p>

                            </div>

                        ) : (

                            <div className="result-content">

                                <div className="result-category">

                                    <div className="category-icon">
                                        {getCategoryIcon()}
                                    </div>

                                    <div>

                                        <span>
                                            PREDICTED CONDITION
                                        </span>

                                        <h3>
                                            {
                                                result.category
                                            }
                                        </h3>

                                    </div>

                                </div>


                                <div className="rainfall-value">

                                    <strong>
                                        {
                                            result.rainfall
                                        }
                                    </strong>

                                    <span>
                                        {
                                            result.unit
                                        }
                                    </span>

                                </div>

                                <p className="rainfall-label">
                                    Predicted Rainfall
                                </p>


                                <div className="meter">

                                    <div className="meter-header">

                                        <span>
                                            Rainfall Intensity
                                        </span>

                                        <strong>
                                            {
                                                result.category
                                            }
                                        </strong>

                                    </div>

                                    <div className="meter-track">

                                        <div
                                            className="meter-fill"
                                            style={{
                                                width:
                                                    `${rainfallValue}%`
                                            }}
                                        />

                                    </div>

                                </div>


                                <div className="result-info">

                                    <div>
                                        🌡️
                                        <div>
                                            <small>
                                                Temperature
                                            </small>

                                            <strong>
                                                {
                                                    formData.avg_temp
                                                } °C
                                            </strong>
                                        </div>
                                    </div>


                                    <div>
                                        💨
                                        <div>
                                            <small>
                                                Wind
                                            </small>

                                            <strong>
                                                {
                                                    formData.wind_speed
                                                } m/s
                                            </strong>
                                        </div>
                                    </div>


                                    <div>
                                        🌬️
                                        <div>
                                            <small>
                                                Pressure
                                            </small>

                                            <strong>
                                                {
                                                    formData.air_pressure
                                                } hPa
                                            </strong>
                                        </div>
                                    </div>


                                    <div>
                                        📍
                                        <div>
                                            <small>
                                                Location
                                            </small>

                                            <strong>
                                                {
                                                    formData.latitude
                                                },
                                                {" "}
                                                {
                                                    formData.longitude
                                                }
                                            </strong>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        )}

                    </div>

                </section>


                {/* =========================
                    HISTORY
                ========================= */}

                <section className="history-section">

                    <div className="history-header">

                        <div>

                            <span className="card-label">
                                RECENT PREDICTIONS
                            </span>

                            <h2>
                                Prediction History
                            </h2>

                            <p>
                                Your latest rainfall predictions
                            </p>

                        </div>

                        {history.length > 0 && (

                            <button
                                type="button"
                                className="clear-history"
                                onClick={clearHistory}
                            >
                                Clear History
                            </button>

                        )}

                    </div>


                    {history.length === 0 ? (

                        <div className="history-empty">
                            🕘
                            <p>
                                No predictions yet.
                            </p>
                        </div>

                    ) : (

                        <div className="history-list">

                            {history.map((item) => (

                                <div
                                    className="history-item"
                                    key={item.id}
                                >

                                    <div className="history-weather">
                                        {item.category
                                            ?.toLowerCase()
                                            .includes("heavy")
                                            ? "🌧️"
                                            : "🌦️"}
                                    </div>


                                    <div className="history-location">

                                        <strong>
                                            {item.location}
                                        </strong>

                                        <small>
                                            {item.date}
                                        </small>

                                    </div>


                                    <div className="history-coordinates">

                                        <small>
                                            Coordinates
                                        </small>

                                        <span>
                                            {item.latitude},
                                            {" "}
                                            {item.longitude}
                                        </span>

                                    </div>


                                    <div className="history-result">

                                        <strong>
                                            {item.rainfall}{" "}
                                            {item.unit}
                                        </strong>

                                        <span>
                                            {item.category}
                                        </span>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>


                {/* =========================
                    FEATURES
                ========================= */}

                <section className="features">

                    <div className="feature">
                        <div className="feature-icon">
                            🤖
                        </div>

                        <div>
                            <h3>
                                XGBoost Machine Learning
                            </h3>

                            <p>
                                Prediction generated using
                                the trained regression model.
                            </p>
                        </div>
                    </div>


                    <div className="feature">
                        <div className="feature-icon">
                            📍
                        </div>

                        <div>
                            <h3>
                                Location Intelligence
                            </h3>

                            <p>
                                Search a location and automatically
                                obtain coordinates.
                            </p>
                        </div>
                    </div>


                    <div className="feature">
                        <div className="feature-icon">
                            🕘
                        </div>

                        <div>
                            <h3>
                                Prediction History
                            </h3>

                            <p>
                                Previous predictions are stored
                                locally in your browser.
                            </p>
                        </div>
                    </div>

                </section>


                <footer>

                    <span>
                        RainPredict AI
                    </span>

                    <span>
                        AI Rainfall Prediction System • 2026
                    </span>

                </footer>

            </main>

        </div>
    );
}

export default RainfallPrediction;