var express = require('express');
var router = express.Router();
var { registerUser } = require('../controllers/user.controller.js');

router.post('/registerUser', registerUser);

module.exports = router;