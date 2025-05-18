var express = require('express');
var router = express.Router();
var { registerUser, restorePasswordRequest, restoreNewPassword } = require('../controllers/user.controller.js');

router.post('/registerUser', registerUser);
router.post('/restorePasswordRequest', restorePasswordRequest);
router.post('/restoreNewPassword', restoreNewPassword);

module.exports = router;