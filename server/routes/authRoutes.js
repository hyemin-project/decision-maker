// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

router.post('/signup', async (req, res) => {
  console.log('Received signup request:', req.body);
  try {
    const { username, email, password, recaptchaToken } = req.body;

    // Verify reCAPTCHA token
    try {
      const recaptchaVerify = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
      );
      
      if (!recaptchaVerify.data.success) {
        console.log('reCAPTCHA verification failed');
        return res.status(400).json({ error: 'reCAPTCHA verification failed' });
      }
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      return res.status(500).json({ error: 'An error occurred during reCAPTCHA verification' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Creating user...");
    const user = await User.create({ username, email, password: hashedPassword });
    console.log("User created with ID:", user.id);

    console.log("Generating JWT...");
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log("JWT generated");

    res.status(201).json({ user: { id: user.id, username: user.username, email: user.email }, token });
    console.log("Signup successful for user:", user.email);
  } catch (error) {
    console.error('Error in signup:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors.map(e => e.message) });
    }
    res.status(500).json({ error: 'An error occurred during signup' });
  }
});

router.post('/login', async (req, res) => {
  console.log('Received login request for email:', req.body.email);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user.user) {
      console.log('Login failed: User not found for email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Login failed: Invalid password for email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log("Generating JWT for user:", user.email);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ user: { id: user.id, username: user.username, email: user.email }, token });
    console.log("Login successful for user:", user.email);
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

router.get('/verify-token', async (req, res) => {
  console.log('Received token verification request');
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user.user) {
      console.log('Token verification failed: User not found for ID:', decoded.userId);
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: { id: user.id, username: user.username, email: user.email } });
    console.log('Token verification successful for user:', user.email);
  } catch (error) {
    console.error('Error in token verification:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;