const mongoose = require('mongoose');

// Define Order model
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    userName: {
      type: String,
      default: '',
    },
    userEmail: {
      type: String,
      default: '',
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: Number,
        price: Number,
        name: String,
        selectedSize: String,
        selectedColor: String,
        selectedLens: String,
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

async function testOrders() {
  try {
    await mongoose.connect('mongodb+srv://admin:12345@cluster0.dwbwu.mongodb.net/ecommerce');
    console.log('Connected to MongoDB');
    
    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(10);
    console.log(`\nFound ${orders.length} orders:\n`);
    
    orders.forEach((order, i) => {
      console.log(`${i + 1}. Order ID: ${order.orderId}`);
      console.log(`   User: ${order.userName} (${order.userEmail})`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Total: ${order.total}`);
      console.log(`   Items: ${order.items.length}`);
      console.log(`   Created: ${order.createdAt}\n`);
    });
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.connection.close();
  }
}

testOrders();
