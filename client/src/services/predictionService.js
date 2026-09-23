import axios from "axios";

const API_URL = "http://localhost:5000/api/prediction";

export const predictRainfall = async (weatherData) => {
    try {
        const response = await axios.post(
            API_URL,
            weatherData
        );

        return response.data;

    } catch (error) {
        console.error(
            "Prediction API Error:",
            error.response?.data || error.message
        );

        throw new Error(
            error.response?.data?.message ||
            "Failed to get rainfall prediction"
        );
    }
};