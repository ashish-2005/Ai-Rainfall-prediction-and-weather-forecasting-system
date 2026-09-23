const axios = require("axios");

const ML_SERVICE_URL =
    process.env.ML_SERVICE_URL || "http://localhost:5001";


/**
 * Send weather data to Flask ML service
 * and get rainfall prediction.
 */
const predictRainfall = async (weatherData) => {

    try {

        const response = await axios.post(
            `${ML_SERVICE_URL}/predict`,
            {
                avg_temp: weatherData.avg_temp,
                min_temp: weatherData.min_temp,
                max_temp: weatherData.max_temp,
                wind_speed: weatherData.wind_speed,
                air_pressure: weatherData.air_pressure,
                elevation: weatherData.elevation,
                latitude: weatherData.latitude,
                longitude: weatherData.longitude
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "ML Service Error:",
            error.response?.data || error.message
        );

        throw new Error(
            "Unable to get prediction from ML service"
        );
    }
};


module.exports = {
    predictRainfall
};