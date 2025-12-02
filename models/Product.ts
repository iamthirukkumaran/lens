import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    modelNumber: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    gender: {
      type: String,
      enum: ['men', 'women', 'kids'],
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      default: 'plastic',
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    images: [String],
    description: String,
    stock: {
      type: Number,
      default: 50,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.pre('save', async function (next) {
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

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
