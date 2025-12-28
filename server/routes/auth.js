const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

// הגדרת הטרנספורטר למייל
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// פונקציה לשליחת מייל
const sendResetEmail = async (email, resetCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'איפוס סיסמה - Farbrengen',
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif;">
        <h2>בקשת איפוס סיסמה</h2>
        <p>קיבלנו בקשה לאיפוס הסיסמה שלך.</p>
        <p>קוד האימות שלך הוא:</p>
        <h1 style="color: #1976d2;">${resetCode}</h1>
        <p>הקוד תקף למשך שעה אחת.</p>
        <p>אם לא ביקשת לאפס את הסיסמה, אנא התעלם מהודעה זו.</p>
        <br>
        <p>בברכה,</p>
        <p>צוות Farbrengen</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reset email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending reset email:', error);
    return false;
  }
};

// Create first admin
router.post('/create-first-admin', async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const { email, password, name } = req.body;
    const user = new User({
      email,
      password,
      name,
      role: 'admin'
    });

    await user.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Error creating admin' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  console.log('=== Login Attempt ===');
  console.log('Email:', req.body.email); // Only log email, never password
  
  try {
    const { email, password } = req.body;
    
    // בדיקה שקיבלנו אימייל וסיסמה
    if (!email || !password) {
      return res.status(400).json({ message: 'נא למלא את כל השדות' });
    }

    // מציאת המשתמש
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'yes' : 'no');

    if (!user) {
      return res.status(401).json({ message: 'אימייל או סיסמה לא נכונים' });
    }

    // בדיקת הסיסמה
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'אימייל או סיסמה לא נכונים' });
    }

    // יצירת טוקן
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // החזרת התשובה
    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
});

// Get current user route
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error in /me route:', error);
    res.status(500).json({ message: 'שגיאה בשרת' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    console.log('Received registration request for email:', req.body.email); // Only log email, never password
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'משתמש כבר קיים במערכת' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password, // Will be hashed by the pre-save hook in the User model
      role: 'user'
    });

    await user.save();
    console.log('User saved successfully:', user._id);

    // Create token
    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Token created successfully');

    // Return response
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === 'admin'
      }
    });
  } catch (error) {
    console.error('Server registration error:', error);
    res.status(500).json({ message: 'שגיאת שרת', error: error.message });
  }
});

// בקשת איפוס סיסמה
router.post('/request-reset', async (req, res) => {
  console.log('=== Reset Password Request ===');
  console.log('1. Endpoint hit');
  
  try {
    const { email } = req.body;
    console.log('2. Email:', email);
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpires = Date.now() + 3600000; // שעה אחת

    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = resetCodeExpires;
    await user.save();

    // שליחת המייל
    const emailSent = await sendResetEmail(email, resetCode);
    
    if (emailSent) {
      res.json({ 
        message: 'קוד אימות נשלח למייל שלך',
        // בסביבת פיתוח בלבד:
        resetCode: process.env.NODE_ENV === 'development' ? resetCode : undefined
      });
    } else {
      res.status(500).json({ message: 'שגיאה בשליחת המייל' });
    }
    
  } catch (error) {
    console.error('Error in request-reset:', error);
    res.status(500).json({ message: 'שגיאה בשליחת קוד האימות' });
  }
});

// אימות קוד
router.post('/verify-reset', async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ 
      email,
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'קוד אימות לא תקין או פג תוקף' });
    }

    res.json({ message: 'קוד אומת בהצלחה' });
  } catch (error) {
    console.error('Error in verify-reset:', error);
    res.status(500).json({ message: 'שגיאה באימות הקוד' });
  }
});

// איפוס סיסמה
router.post('/reset-password', async (req, res) => {
  console.log('=== Reset Password Attempt ===');
  console.log('1. Request received:', {
    email: req.body.email,
    code: req.body.code,
    passwordLength: req.body.newPassword?.length
  });
  
  try {
    const { email, code, newPassword } = req.body;
    
    // מצא את המשתמש
    const user = await User.findOne({ 
      email,
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    console.log('2. User found:', !!user);

    if (!user) {
      return res.status(400).json({ message: 'קוד אימות לא תקין או פג תוקף' });
    }

    // הצפנת הסיסמה החדשה
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    console.log('4. Password hashed:', hashedPassword);

    // עדכון המשתמש ישירות בדאטהבייס
    const result = await User.updateOne(
      { _id: user._id },
      { 
        $set: { password: hashedPassword },
        $unset: { 
          resetPasswordCode: "",
          resetPasswordExpires: ""
        }
      }
    );
    
    console.log('5. Update result:', result);

    // בדיקה שהסיסמה נשמרה נכון
    const updatedUser = await User.findOne({ email });
    console.log('6. Password updated successfully');
    
    const isMatch = await bcrypt.compare(newPassword, updatedUser.password);
    console.log('7. Password verification test:', isMatch);

    if (!isMatch) {
      console.error('Password update failed verification');
      return res.status(500).json({ message: 'שגיאה בעדכון הסיסמה' });
    }

    res.json({ message: 'הסיסמה אופסה בהצלחה' });
  } catch (error) {
    console.error('Error in reset-password:', error);
    res.status(500).json({ message: 'שגיאה באיפוס הסיסמה' });
  }
});

module.exports = router; 