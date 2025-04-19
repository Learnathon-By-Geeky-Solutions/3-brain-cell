const nodemailer = require('nodemailer');
const config = require('../config/env');

const sendVerificationEmail = async (email, code) => {
 
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
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
  
    try {
        await transporter.sendMail(mailOptions);
      } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email.');
      }
  };


const sendPasswordResetEmail = async (email, resetCode) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: config.email.user, 
      pass: config.email.mailpass,
    },
  });

  const mailOptions = {
    from: config.email.user,
    to: email,
    subject: 'Password Reset Request',
    text: `Your password reset code is: ${resetCode}. This code is valid for 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw new Error('Failed to send password reset email.');
  }
};

module.exports = { sendPasswordResetEmail, sendVerificationEmail };
