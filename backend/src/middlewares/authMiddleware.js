const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { AppDataSource } = require('../config/database');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { userId: decoded.id },
      relations: ['organization', 'volunteer', 'coordinator'],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid user.' });
    }

    req.user = {
      id: user.userId,
      role: user.role,
      email: user.email,
      organizationId: user.organization?.organization_id || null,
      volunteerId: user.volunteer?.volunteer_id || null,
      coordinatorId: user.coordinator?.coordinator_id || null,
    };

    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden: Incorrect role' });
    }
    next();
  };
};

module.exports = { verifyToken, requireRole };
