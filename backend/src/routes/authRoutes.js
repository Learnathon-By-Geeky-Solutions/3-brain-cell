const express = require('express');
const { register, login, verifyEmail } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);

module.exports = router;
