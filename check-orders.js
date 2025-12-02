const mongoose = require('mongoose');

async function checkOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://kumaranthiru478:Thiru%402772@cluster0.mvf14fv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    
    const db = mongoose.connection.db;
    const orders = db.collection('orders');
    
    const allOrders = await orders.find({}).limit(5).toArray();
    console.log(`Found ${allOrders.length} orders:\n`);
    
    allOrders.forEach((order, i) => {
      console.log(`${i + 1}. Order: ${order.orderId}`);
      console.log(`   userName: ${order.userName || 'MISSING'}`);
      console.log(`   userEmail: ${order.userEmail || 'MISSING'}`);
      console.log(`   shippingAddress.email: ${order.shippingAddress?.email || 'MISSING'}`);
      console.log('---');
    });
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.connection.close();
  }
}

checkOrders();
