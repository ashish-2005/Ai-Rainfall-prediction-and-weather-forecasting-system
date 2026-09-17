const express = require("express");

const {
    getRainfallPrediction
} = require("../controllers/predictionController");

const router = express.Router();

router.post("/rainfall", getRainfallPrediction);

module.exports = router;