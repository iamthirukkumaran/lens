const mongoose = require('mongoose');

const mongoURL = 'mongodb://localhost:27017/eyewear';

async function testProductCreation() {
  try {
    await mongoose.connect(mongoURL);
    console.log('MongoDB connected');

    const productSchema = new mongoose.Schema({
      name: String,
      modelNumber: { type: String, default: null },
      price: Number,
      mrp: Number,
      discount: { type: Number, default: 0 },
      gender: { type: String, enum: ['men', 'women', 'kids'] },
      brand: String,
      material: { type: String, default: 'plastic' },
      sizes: { type: [String], default: [] },
      colors: { type: [String], default: [] },
      images: [String],
      description: String,
      stock: { type: Number, default: 50 },
      createdAt: { type: Date, default: Date.now }
    });

    productSchema.pre('save', async function (next) {
      if (!this.modelNumber) {
        // Generate 5-digit alphanumeric code
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 5; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        this.modelNumber = code;
      }
      next();
    });

    const Product = mongoose.model('Product', productSchema);

    // Test product creation
    const testProduct = new Product({
      name: 'Test Sunglasses',
      price: 49.99,
      mrp: 99.99,
      discount: 50,
      gender: 'men',
      brand: 'TestBrand',
      material: 'plastic',
      sizes: ['S', 'M', 'L'],
      colors: ['Black', 'Brown'],
      images: ['https://example.com/image1.jpg'],
      description: 'Test product for adding products'
    });

    await testProduct.save();

    console.log('✓ Product created successfully!');
    console.log('Product ID:', testProduct._id);
    console.log('Model Number:', testProduct.modelNumber);
    console.log('Name:', testProduct.name);

    process.exit(0);
  } catch (err) {
    console.error('✗ Error:', err.message);
    process.exit(1);
  }
}

testProductCreation();
