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

const sendPasswordResetEmail = async (email, code) => {
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
    subject: 'Password Reset Request',
    text: `Your password reset code is: ${code}. This code is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};


const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(resetCode, 10);

    user.passwordResetToken = hashedCode;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await userRepository.save(user);

    await sendPasswordResetEmail(email, resetCode);

    res.status(200).json({ message: "Password reset email sent. Please check your inbox." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const resetPassword = async (req, res) => {
  try {
    const {  resetCode, email, newPassword, confirmPassword } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.passwordResetToken || !user.passwordResetExpires) {
      return res.status(400).json({ message: "No reset token found. Please request a new one." });
    }

    if (new Date() > user.passwordResetExpires) {
      return res.status(400).json({ message: "Reset token expired. Please request a new one." });
    }

    const isValid = await bcrypt.compare(resetCode, user.passwordResetToken);
    if (!isValid) return res.status(400).json({ message: "Invalid reset code." });

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await userRepository.save(user);

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.emailVerificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    user.emailVerified = true;
    user.emailVerificationCode = null;
    await userRepository.save(user);

    const emailVerificationToken = jwt.sign({ id: user.userId, email: user.email, role: user.role },
      process.env.JWT_SECRET,{ expiresIn: "30m" } );

    res.status(200).json({
      message: "Email verified successfully. Proceed to complete your profile.",
      emailVerificationToken: emailVerificationToken
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const register = async (req, res) => {
  const { name, email, mobile, password, location, role } = req.body;
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
      role,
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

    const loginToken = jwt.sign({ id: user.userId, email: user.email, role: user.role },   jwtConfig.secret, { expiresIn: '1h' } );
    

    res.status(200).json({ 
      message:"Login successful!",
      loginToken: loginToken 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { register, login, verifyEmail, requestPasswordReset, resetPassword };