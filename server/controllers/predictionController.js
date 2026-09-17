const { predictRainfall } = require("../services/mlService");

const getRainfallPrediction = async (req, res) => {
    try {
        const {
            temperature,
            humidity,
            pressure,
            wind_speed
        } = req.body;

        if (
            temperature === undefined ||
            humidity === undefined ||
            pressure === undefined ||
            wind_speed === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "All weather parameters are required"
            });
        }

        const result = await predictRainfall({
            temperature,
            humidity,
            pressure,
            wind_speed
        });

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getRainfallPrediction
};