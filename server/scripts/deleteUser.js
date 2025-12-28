require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');

// SECURITY: Never hardcode credentials - always use environment variables

async function deleteUser() {
  try {
    console.log('מתחבר לדאטהבייס...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('מחובר לדאטהבייס');
    
    const result = await User.deleteOne({ email: 'admin@example.com' });
    
    if (result.deletedCount > 0) {
      console.log('המשתמש נמחק בהצלחה');
    } else {
      console.log('המשתמש לא נמצא');
    }
    
    await mongoose.connection.close();
    console.log('החיבור לדאטהבייס נסגר');
  } catch (error) {
    console.error('שגיאה במחיקת המשתמש:', error);
    process.exit(1);
  }
}

deleteUser(); 