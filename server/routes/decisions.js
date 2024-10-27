const express = require('express');
const router = express.Router();
const { Result } = require('../models');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  console.log('User from auth middleware:', req.user);
  
  try {
    if (!req.user || !req.user.id) {
      console.log('User not authenticated - req.user:', req.user);
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const decisions = await Result.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    console.log('Decisions found:', decisions.length);
    
    res.json(decisions);
  } catch (error) {
    console.error('Error fetching decision history:', error);
    res.status(500).json({ error: 'An error occurred while fetching decision history', details: error.message });
  }
});

module.exports = router;