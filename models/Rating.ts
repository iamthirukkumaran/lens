import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      default: '',
    },
    userName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Rating = mongoose.models.Rating || mongoose.model('Rating', ratingSchema);

export default Rating;
