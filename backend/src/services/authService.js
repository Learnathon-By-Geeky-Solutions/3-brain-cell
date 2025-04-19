const { AppDataSource } = require('../config/database');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const jwtConfig = require('../config/jwtConfig');
const jwt = require('jsonwebtoken');
const { UserAlreadyExistsError, InvalidCredentialsError, UserDoesNotExistError, PasswordResetExpiredError } = require('../utils/errors');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailHelper'); 

const registerUser = async (data) => {
  const { name, email, mobile, password, location, role } = data;

  const existingUser = await AppDataSource.getRepository(User).findOne({ where: { email } });
  if (existingUser) throw new UserAlreadyExistsError();

  const verificationCode = crypto.randomInt(100000, 1000000).toString();
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = AppDataSource.getRepository(User).create({
    name, email, mobile, password: hashedPassword, location, role, emailVerificationCode: verificationCode, emailVerified: false
  });

  await AppDataSource.getRepository(User).save(newUser);

  await sendVerificationEmail(email, verificationCode);

};

const loginUser = async (data) => {
  const { email, password } = data;

  const user = await AppDataSource.getRepository(User).findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new InvalidCredentialsError();
  }

  const loginToken = jwt.sign({ 
    id: user.userId, 
    email: user.email, 
    role: user.role 
  }, jwtConfig.secret, { expiresIn: '1h' });

  return { loginToken };
};


const requestForgotPasswordReset = async (email) => {
  const user = await AppDataSource.getRepository(User).findOne({ where: { email } });
  if (!user) throw new UserDoesNotExistError();

  const resetCode = crypto.randomInt(100000, 1000000).toString();
  const hashedCode = await bcrypt.hash(resetCode, 10);

  user.passwordResetToken = hashedCode;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); 

  await AppDataSource.getRepository(User).save(user);

  await sendPasswordResetEmail(email, resetCode);
};


const verifyUserEmail = async (email, code) => {
  const user = await AppDataSource.getRepository(User).findOne({ where: { email } });
  if (!user) throw new UserDoesNotExistError();

  if (user.emailVerificationCode !== code) {
    throw new InvalidCredentialsError('Invalid verification code');
  }

  user.emailVerified = true;
  user.emailVerificationCode = null;
  await AppDataSource.getRepository(User).save(user);

  const emailVerificationToken = jwt.sign({ id: user.userId, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30m" });

  return { emailVerificationToken };
};


const resetPassword = async (email, resetCode, newPassword, confirmPassword) => {
  const user = await AppDataSource.getRepository(User).findOne({ where: { email } });
  if (!user) throw new UserDoesNotExistError();

  if (!user.passwordResetToken || !user.passwordResetExpires) {
    throw new PasswordResetExpiredError('No reset token found or expired');
  }

  if (new Date() > user.passwordResetExpires) {
    throw new PasswordResetExpiredError();
  }

  const isValid = await bcrypt.compare(resetCode, user.passwordResetToken);
  if (!isValid) throw new InvalidCredentialsError('Invalid reset code.');

  if (newPassword !== confirmPassword) {
    throw new InvalidCredentialsError('Passwords do not match.');
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.passwordResetToken = null;
  user.passwordResetExpires = null;

  await AppDataSource.getRepository(User).save(user);
};


module.exports = { registerUser, loginUser, requestForgotPasswordReset, verifyUserEmail, resetPassword };
