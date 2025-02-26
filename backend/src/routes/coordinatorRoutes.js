const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { getCoordinators,createCoordinator } = require('../controllers/coordinatorController');

const router = express.Router();

router.get('/', authenticate, getCoordinators);
router.post('/', createCoordinator);

module.exports = router;
