const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { getVolunteers,createVolunteer } = require('../controllers/volunteerController');

const router = express.Router();

router.get('/', authenticate, getVolunteers);
router.post('/', createVolunteer); 

module.exports = router;