const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const mongoURL = 'mongodb://localhost:27017/eyewear';

async function seed() {
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

    const User = mongoose.model('User', userSchema);
    
    // Delete existing demo users
    await User.deleteMany({
      email: { $in: ['admin@demo.com', 'customer@demo.com'] }
    });
    
    // Create admin
    const admin = new User({
      name: 'Admin User',
      email: 'admin@demo.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    
    // Create customer
    const customer = new User({
      name: 'John Customer',
      email: 'customer@demo.com',
      password: 'customer123',
      role: 'customer'
    });
    await customer.save();
    
    console.log('Demo users created:');
    console.log('Admin: admin@demo.com / admin123');
    console.log('Customer: customer@demo.com / customer123');
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

seed();
