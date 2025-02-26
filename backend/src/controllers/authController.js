const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AppDataSource } = require('../config/database');
const User = require('../models/User');
const jwtConfig = require('../config/jwtConfig');
const nodemailer = require('nodemailer');
const config = require('../config/env');


const sendVerificationEmail = async (email, code) => {
 
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.email.user,      
      pass: config.email.mailpass,  
    },
  });

  const mailOptions = {
    from: config.email.user,
    to: email,
    subject: 'Verify Your Email',
    text: `Your verification code is: ${code}`,
  };

  await transporter.sendMail(mailOptions);
};

const register = async (req, res) => {
  const { name, email, mobile, password, location } = req.body;
  try {
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

   
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      location,
      emailVerificationCode: verificationCode, 
      emailVerified: false,                   
    });
    await userRepository.save(user);

   
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

   
    if (!user.emailVerified) {
      return res.status(403).json({ message: 'Email not verified. Please verify your email before logging in.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, jwtConfig.secret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

   
    if (user.emailVerificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    
    user.emailVerified = true;
    user.emailVerificationCode = null;
    await userRepository.save(user);

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, verifyEmail };