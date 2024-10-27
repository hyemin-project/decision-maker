const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  console.log('Auth middleware - headers:', req.headers);

  const authHeader = req.headers['authorization'];
  console.log('Auth header:', authHeader);

  const token = authHeader && authHeader.split(' ')[1];
  console.log('Extracted token:', token);

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = {
      id: decoded.id || decoded.userId,
      email: decoded.email
    };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;