const express = require('express');
const { completeRegistration } = require('../controllers/profileController');
//const { authenticate } = require('../middlewares/authMiddleware');


const router = express.Router();

//router.post('/complete', authenticate, completeRegistration);
router.post('/complete', completeRegistration);

module.exports = router;
