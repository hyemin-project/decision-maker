const express = require('express');
const router = express.Router();
const { Result } = require('../models');

router.post('/', async (req, res) => {
  try {
    const { userId, decisionQuestion, result, choices } = req.body;
    
    // Log the received data for debugging
    console.log('Received data:', { userId, decisionQuestion, result, choices });

    // Create the result, allowing userId to be null if not provided
    const newResult = await Result.create({
      userId,
      decisionQuestion,
      result,
      choices
    });

    res.status(201).json(newResult);
  } catch (error) {
    console.error('Error saving result:', error);
    res.status(500).json({ error: 'An error occurred while saving the result' });
  }
});

module.exports = router;