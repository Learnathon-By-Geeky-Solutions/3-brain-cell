const express = require('express');
const { completeRegistration } = require('../controllers/profileController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { generalLimiter } = require('../utils/rateLimiter');

const router = express.Router();

router.post('/complete', generalLimiter, verifyToken, completeRegistration);

module.exports = router;
