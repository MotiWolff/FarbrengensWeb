const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

async function createAdmin() {
  try {
    console.log('Starting admin creation...');
    // MongoDB URI intentionally not logged to protect credentials
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // מחק את המשתמש הקיים אם יש
    await User.deleteOne({ email: 'farbrengensapp@gmail.com' });
    console.log('Deleted existing admin if any');

    const plainPassword = 'MotiSterni5784';    
    // Password intentionally not logged for security
    
    // צור מנהל חדש
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log('Password hashed successfully');

    const admin = new User({
      name: 'מנהל',
      email: 'farbrengensapp@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });

    const savedAdmin = await admin.save();
    console.log('Admin user created successfully:', {
      id: savedAdmin._id,
      email: savedAdmin.email,
      role: savedAdmin.role,
      passwordHash: savedAdmin.password
    });

    // בדוק שהסיסמה עובדת
    const isMatch = await bcrypt.compare(plainPassword, savedAdmin.password);
    console.log('Password verification test:', isMatch);

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.connection.close();
  }
}

createAdmin(); 