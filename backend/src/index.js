const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const { AppDataSource } = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const coordinatorRoutes = require('./routes/coordinatorRoutes');

const app = express();
const PORT = config.port;

app.use(express.json());

app.use(cors());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/profile',profileRoutes);
app.use('/organizations', organizationRoutes);
app.use('/volunteers', volunteerRoutes);
app.use('/coordinators', coordinatorRoutes);



AppDataSource.initialize()
  .then(() => {
    console.log('Database connected!');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error('Database connection error:', error));
