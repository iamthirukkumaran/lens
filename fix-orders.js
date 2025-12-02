const mongoose = require('mongoose');

async function fixOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://kumaranthiru478:Thiru%402772@cluster0.mvf14fv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    
    const db = mongoose.connection.db;
    const orders = db.collection('orders');
    
    // Get all orders
    const allOrders = await orders.find({}).toArray();
    console.log(`Found ${allOrders.length} orders to process\n`);
    
    let updated = 0;
    
    // Update each order
    for (const order of allOrders) {
      const updates = {};
      
      // Set userName if missing
      if (!order.userName && order.shippingAddress?.fullName) {
        updates.userName = order.shippingAddress.fullName;
      } else if (!order.userName) {
        updates.userName = 'Customer';
      }
      
      // Set userEmail if missing
      if (!order.userEmail && order.shippingAddress?.email) {
        updates.userEmail = order.shippingAddress.email;
      } else if (!order.userEmail) {
        updates.userEmail = '';
      }
      
      // Update if there are changes
      if (Object.keys(updates).length > 0) {
        await orders.updateOne({ _id: order._id }, { $set: updates });
        updated++;
        console.log(`Updated order ${order.orderId}:`);
        console.log(`  userName: ${updates.userName || order.userName || 'unchanged'}`);
        console.log(`  userEmail: ${updates.userEmail || order.userEmail || 'unchanged'}`);
      }
    }
    
    console.log(`\nTotal orders updated: ${updated}`);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.connection.close();
  }
}

fixOrders();
