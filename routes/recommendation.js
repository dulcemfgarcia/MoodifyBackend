const express = require('express');
const router = express.Router();
const { getAnalysis } = require('../controllers/recommendation.controller.js');

router.post('/recommend', getAnalysis);

module.exports = router;