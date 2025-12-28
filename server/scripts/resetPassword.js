const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
require('dotenv').config({ path: '../.env' });

const findAndResetPassword = async (email, newPassword) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/farbrengen');
    
    // קודם נחפש את המשתמש
    const existingUser = await User.findOne({ email });
    
    if (!existingUser) {
      console.log('משתמש לא נמצא עבור אימייל:', email);
      console.log('משתמשים קיימים:');
      const allUsers = await User.find({}, 'email name');
      console.log(allUsers);
      return;
    }

    // אם מצאנו את המשתמש, נאפס את הסיסמה
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    console.log('הסיסמה אופסה בהצלחה עבור:', updatedUser.email);
    console.log('פרטי המשתמש:', {
      name: updatedUser.name,
      email: updatedUser.email,
      id: updatedUser._id
    });

  } catch (error) {
    console.error('שגיאה:', error);
  } finally {
    await mongoose.disconnect();
  }
};

// החלף את האימייל והסיסמה החדשה שאתה רוצה להגדיר
findAndResetPassword('motiwolff@gmail.com', 'MotiSterni5784');