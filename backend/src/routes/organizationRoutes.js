const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { getOrganizations,createOrganization } = require('../controllers/organizationController');

const router = express.Router();

router.get('/', authenticate, getOrganizations); 
router.post('/', createOrganization);

module.exports = router;
