const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { getProfile } = require('../controllers/userController');

const router = express.Router();

router.get('/profile', authenticate, getProfile);

module.exports = router;
