const express = require('express');
const router = express.Router();
const Farbrengen = require('../models/farbrengen');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get upcoming farbrengens
router.get('/upcoming', async (req, res) => {
  try {
    const now = new Date();
    const farbrengens = await Farbrengen
      .find({ date: { $gte: now } })
      .sort({ date: 1 })
      .populate('creator', 'name')
      .limit(10);

    console.log(`Found ${farbrengens.length} upcoming farbrengens`);
    res.json(farbrengens);
  } catch (error) {
    console.error('Error fetching upcoming farbrengens:', error);
    res.status(500).json({ 
      message: 'שגיאה בטעינת התוועדויות קרובות',
      error: error.message 
    });
  }
});

// Get all farbrengens
router.get('/', async (req, res) => {
  try {
    const { from, before, sort = 'date' } = req.query;
    let query = {};
    
    if (from) {
      query.date = { $gte: new Date(from) };
    }
    if (before) {
      query.date = { ...query.date, $lt: new Date(before) };
    }

    console.log('Fetching farbrengens with query:', query);
    
    const farbrengens = await Farbrengen
      .find(query)
      .sort(sort)
      .populate('creator', 'name');

    console.log(`Found ${farbrengens.length} farbrengens`);
    res.json(farbrengens);
  } catch (error) {
    console.error('Error fetching farbrengens:', error);
    res.status(500).json({ 
      message: 'שגיאה בטעינת התוועדויות',
      error: error.message 
    });
  }
});

// Get single farbrengen
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching farbrengen with ID:', req.params.id);
    
    const farbrengen = await Farbrengen.findById(req.params.id)
      .populate({
        path: 'creator',
        select: 'name email'
      });

    if (!farbrengen) {
      return res.status(404).json({ message: 'התוועדות לא נמצאה' });
    }

    console.log('Found farbrengen:', JSON.stringify(farbrengen, null, 2));
    res.json(farbrengen);
  } catch (error) {
    console.error('Full error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    res.status(500).json({ 
      message: 'שגיאה בטעינת ההתוועדות',
      details: error.message 
    });
  }
});

// Create new farbrengen
router.post('/', auth, async (req, res) => {
  try {
    console.log('Request user from token:', req.user);
    console.log('User ID from token:', req.user.userId);
    
    const farbrengenData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      speaker: req.body.speaker,
      type: req.body.type,
      language: req.body.language,
      gender: req.body.gender,
      isOnline: req.body.isOnline,
      zoomLink: req.body.zoomLink,
      creator: req.user.userId
    };
    
    console.log('Final farbrengen data before save:', farbrengenData);

    const farbrengen = new Farbrengen(farbrengenData);
    console.log('Farbrengen object before save:', farbrengen);
    
    const savedFarbrengen = await farbrengen.save();
    console.log('Farbrengen saved successfully:', savedFarbrengen);
    
    res.status(201).json(savedFarbrengen);
  } catch (error) {
    console.error('Full error object:', error);
    res.status(500).json({ 
      message: 'שגיאה ביצירת התוועדות',
      error: error.message,
      details: error 
    });
  }
});

// Update farbrengen
router.put('/:id', auth, async (req, res) => {
  try {
    const farbrengen = await Farbrengen.findById(req.params.id);
    if (!farbrengen) {
      return res.status(404).json({ message: 'התוועדות לא נמצאה' });
    }

    if (farbrengen.creator.toString() !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'אין הרשאה לעריכה' });
    }

    Object.assign(farbrengen, req.body);
    await farbrengen.save();
    res.json(farbrengen);
  } catch (error) {
    console.error('Error updating farbrengen:', error);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
});

// Delete farbrengen
router.delete('/:id', auth, async (req, res) => {
  try {
    const farbrengen = await Farbrengen.findById(req.params.id);
    if (!farbrengen) {
      return res.status(404).json({ message: 'התוועדות לא נמצאה' });
    }

    if (farbrengen.creator.toString() !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'אין הרשאה למחיקה' });
    }

    await farbrengen.deleteOne();
    res.json({ message: 'התוועדות נמחקה בהצלחה' });
  } catch (error) {
    console.error('Error deleting farbrengen:', error);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
});

module.exports = router; 