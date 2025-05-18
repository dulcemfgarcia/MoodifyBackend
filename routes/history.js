const express = require('express');
const router = express.Router();
const { getHistory } = require('../controllers/history.controller.js');

router.get('/history', getHistory);

module.exports = router;
