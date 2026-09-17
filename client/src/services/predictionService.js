import axios from "axios";

const API_URL = "http://localhost:5000/api/prediction";

export const predictRainfall = async (weatherData) => {
    const response = await axios.post(
        `${API_URL}/rainfall`,
        weatherData
    );

    return response.data;
};