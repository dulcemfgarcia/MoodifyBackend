var express = require('express');
var router = express.Router();
var { login } = require('../controllers/auth.controller.js');

router.post('/login', login);

module.exports = router;