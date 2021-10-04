import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  active: {
    type: Boolean,
    default: false
  },
  email: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  wishlist: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
    default: []
  }],
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review',
    default: []
  }],
  cartItems: {
    type: [{
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
      }
    }],
    default: []
  },
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order',
    default: []
  }],
})

export const User = mongoose.model('User', userSchema);