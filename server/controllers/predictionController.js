const { predictRainfall } = require("../services/mlService");


const getPrediction = async (req, res) => {

    try {

        const weatherData = req.body;

        const requiredFields = [
            "avg_temp",
            "min_temp",
            "max_temp",
            "wind_speed",
            "air_pressure",
            "elevation",
            "latitude",
            "longitude"
        ];

        const missingFields = requiredFields.filter(
            (field) =>
                weatherData[field] === undefined ||
                weatherData[field] === null ||
                weatherData[field] === ""
        );

        if (missingFields.length > 0) {

            return res.status(400).json({
                success: false,
                message: "Missing required weather fields",
                missingFields
            });
        }

        const result = await predictRainfall(weatherData);

        return res.status(200).json(result);

    } catch (error) {

        console.error("Prediction Controller Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to generate rainfall prediction"
        });
    }
};


module.exports = {
    getPrediction
};