const express = require("express");
const cors = require("cors");
require("dotenv").config();

const predictionRoutes = require("./routes/predictionRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/prediction", predictionRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "AI Rainfall Prediction API is running"
    });
});

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend is working"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});