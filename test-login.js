const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const mongoURL = 'mongodb://localhost:27017/eyewear';

async function testLogin() {
  try {
    await mongoose.connect(mongoURL);
    console.log('MongoDB connected');

    const userSchema = new mongoose.Schema({
      name: String,
      email: { type: String, unique: true },
      password: String,
      role: { type: String, default: 'customer' },
      createdAt: { type: Date, default: Date.now }
    });

    userSchema.methods.comparePassword = async function (candidatePassword) {
      return bcryptjs.compare(candidatePassword, this.password);
    };

    const User = mongoose.model('User', userSchema);
    
    // Find admin user
    const admin = await User.findOne({ email: 'admin@demo.com' }).select('+password');
    
    if (!admin) {
      console.log('Admin user not found!');
      process.exit(1);
    }
    
    console.log('Admin user found:');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Hashed password (first 20 chars):', admin.password.substring(0, 20));
    
    // Test password comparison
    const isValid = await admin.comparePassword('admin123');
    console.log('Password verification result:', isValid);
    
    if (isValid) {
      console.log('✓ Admin login will work correctly');
    } else {
      console.log('✗ Admin login will FAIL');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

testLogin();
