const axios = require("axios");

const predictRainfall = async (weatherData) => {
    try {
        const response = await axios.post(
            "http://localhost:5001/predict",
            weatherData
        );

        return response.data;
    } catch (error) {
        console.error("ML Service Error:", error.message);
        throw new Error("Unable to connect to ML service");
    }
};

module.exports = {
    predictRainfall
};