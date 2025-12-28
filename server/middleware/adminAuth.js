const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    console.log('=== Admin Auth Middleware Start ===');
    const authHeader = req.header('Authorization');
    console.log('Admin auth - Auth header:', authHeader);

    if (!authHeader) {
      console.log('No auth header found');
      return res.status(401).json({ message: 'אין טוקן, הגישה נדחתה' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);

    const user = await User.findById(decoded.userId);
    console.log('User found:', user);

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'משתמש לא נמצא' });
    }

    if (user.role !== 'admin') {
      console.log('User is not admin. Role:', user.role);
      return res.status(403).json({ message: 'אין הרשאת מנהל' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({ message: 'שגיאת שרת', error: error.message });
  }
}; 