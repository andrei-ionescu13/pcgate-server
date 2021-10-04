import mongoose from 'mongoose';
import { productSchema } from './product.js';
const { Schema } = mongoose;

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  items: {
    type: [{
      product: productSchema
    }],
    default: []
  },
  amount: Number,
  currency: String
});

export const Order = mongoose.model('Order', orderSchema);
