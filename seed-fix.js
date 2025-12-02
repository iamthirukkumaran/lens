const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const mongoURL = 'mongodb://localhost:27017/eyewear';

async function fixPasswords() {
  try {
    await mongoose.connect(mongoURL);
    console.log('MongoDB connected');

    // Define schema with pre-save hook
    const userSchema = new mongoose.Schema({
      name: String,
      email: { type: String, unique: true },
      password: String,
      role: { type: String, default: 'customer' },
      createdAt: { type: Date, default: Date.now }
    });

    userSchema.pre('save', async function (next) {
      if (!this.isModified('password')) {
        return next();
      }
      try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
        next();
      } catch (error) {
        next(error);
      }
    });

    userSchema.methods.comparePassword = async function (candidatePassword) {
      return bcryptjs.compare(candidatePassword, this.password);
    };

    const User = mongoose.model('User', userSchema);
    
    // Delete existing demo users
    await User.deleteMany({
      email: { $in: ['admin@demo.com', 'customer@demo.com'] }
    });
    
    // Create admin with pre-save hook
    const admin = new User({
      name: 'Admin User',
      email: 'admin@demo.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    
    // Create customer with pre-save hook
    const customer = new User({
      name: 'John Customer',
      email: 'customer@demo.com',
      password: 'customer123',
      role: 'customer'
    });
    await customer.save();
    
    console.log('Demo users created successfully');
    
    // Test password
    const adminCheck = await User.findOne({ email: 'admin@demo.com' }).select('+password');
    const isValid = await adminCheck.comparePassword('admin123');
    console.log('Admin password verification:', isValid ? '✓ PASS' : '✗ FAIL');
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

fixPasswords();
