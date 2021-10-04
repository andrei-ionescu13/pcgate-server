import mongoose from 'mongoose';
import { Product } from './product.js';
import { User } from './user.js';
const { Schema } = mongoose;

const reviewSchema = new Schema({
  slug: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  recommended: Boolean,
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
});

reviewSchema.pre('deleteOne', async function () {
  try {
    const review = await this.model.findOne(this.getQuery());

    const user = await User.findOne({ _id: review.userId });
    const product = await Product.findOne({ _id: review.productId });

    user.reviews = user.reviews.filter((review) => review._id.toString() !== review._id.toString());
    product.reviews = product.reviews.filter((review) => review._id.toString() !== review._id.toString());

    await user.save();
    await product.save();
  } catch (error) {
    console.log(error)
  }

})

export const Review = mongoose.model('Review', reviewSchema);