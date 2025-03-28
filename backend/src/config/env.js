require('dotenv').config();

const config = {
  port:process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  email: {
    user: process.env.EMAIL_USER,
    mailpass: process.env.EMAIL_PASSWORD
  },
  weather: {
    apiKey: process.env.ACCUWEATHER_API_KEY,
    apiUrl: process.env.ACCUWEATHER_API_URL
  }
};

module.exports = config;
