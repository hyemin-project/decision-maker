const express = require('express');
const router = express.Router();
const { User } = require('../models');

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add more routes as needed

module.exports = router;