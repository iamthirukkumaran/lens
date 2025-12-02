const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

// MongoDB connection - use the URI directly
const mongoUrl = 'mongodb+srv://kumaranthiru478:Thiru%402772@cluster0.mvf14fv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function seedAdmin() {
  try {
    await mongoose.connect(mongoUrl);
    console.log('✓ Connected to MongoDB');

    // Define User schema inline
    const userSchema = new mongoose.Schema({
      name: String,
      email: { type: String, unique: true, lowercase: true },
      password: String,
      role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    });

    // Pre-save hook to hash password
    userSchema.pre('save', async function(next) {
      if (!this.isModified('password')) return next();
      try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
        next();
      } catch (error) {
        next(error);
      }
    });

    const User = mongoose.model('User', userSchema);

    // Clear existing demo users
    await User.deleteMany({
      $or: [
        { email: 'admin@demo.com' },
        { email: 'customer@demo.com' },
      ],
    });
    console.log('✓ Cleared existing demo users');

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@demo.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('✓ Admin created:', admin.email);

    // Create customer
    const customer = await User.create({
      name: 'John Customer',
      email: 'customer@demo.com',
      password: 'customer123',
      role: 'customer',
    });
    console.log('✓ Customer created:', customer.email);

    console.log('\n✅ Demo accounts created successfully!\n');
    console.log('Admin Credentials:');
    console.log('  Email: admin@demo.com');
    console.log('  Password: admin123\n');
    console.log('Customer Credentials:');
    console.log('  Email: customer@demo.com');
    console.log('  Password: customer123\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedAdmin();
