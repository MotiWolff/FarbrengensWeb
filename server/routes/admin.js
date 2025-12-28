const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Farbrengen = require('../models/farbrengen');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const adminAuth = require('../middleware/adminAuth');

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    console.log('Admin route - Authenticated user:', req.user);
    
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    
    console.log('Found users:', users.length);
    res.json(users);
  } catch (error) {
    console.error('Error in /admin/users:', error);
    res.status(500).json({ 
      message: 'שגיאה בשליפת המשתמשים',
      error: error.message 
    });
  }
});

// Get admin statistics
router.get('/statistics', [auth, admin], async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarbrengens = await Farbrengen.countDocuments();
    
    const farbrengensByType = await Farbrengen.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);

    const usersByMonth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    res.json({
      totalUsers,
      totalFarbrengens,
      farbrengensByType,
      usersByMonth
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
});

// Get all farbrengens for admin
router.get('/farbrengens', adminAuth, async (req, res) => {
  try {
    console.log('Getting farbrengens for admin');
    console.log('User:', req.user);
    
    const farbrengens = await Farbrengen.find()
      .populate('creator', 'name email');
    
    console.log('Found farbrengens:', farbrengens.length);
    res.json(farbrengens);
  } catch (error) {
    console.error('Error in admin farbrengens route:', error);
    res.status(500).json({ 
      message: 'שגיאה בטעינת ההתוועדויות',
      error: error.message 
    });
  }
});

// Toggle user role (admin/user)
router.put('/users/:id/toggle-role', [auth, admin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }

    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Error toggling user role:', error);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
});

// Delete user
router.delete('/users/:id', [auth, admin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }

    // Don't allow deleting other admins
    if (user.role === 'admin' && user._id.toString() !== req.user._id) {
      return res.status(403).json({ message: 'לא ניתן למחוק מנהל אחר' });
    }

    await user.deleteOne();
    res.json({ message: 'משתמש נמחק בהצלחה' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
});

// Update farbrengen status
router.put('/farbrengens/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const farbrengen = await Farbrengen.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('createdBy', 'name email');

    if (!farbrengen) {
      return res.status(404).json({ message: 'התוועדות לא נמצאה' });
    }

    res.json(farbrengen);
  } catch (error) {
    console.error('Error updating farbrengen status:', error);
    res.status(500).json({ 
      message: 'שגיאה בעדכון סטטוס ההתוועדות',
      error: error.message 
    });
  }
});

module.exports = router; 