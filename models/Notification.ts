import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    productId: {
      type: String,
      required: true,
    },
    productName: String,
    type: {
      type: String,
      enum: ['stock', 'price_drop', 'new_arrival'],
      default: 'stock',
    },
    notified: {
      type: Boolean,
      default: false,
    },
    email: String,
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model('Notification', notificationSchema);

export default Notification;
