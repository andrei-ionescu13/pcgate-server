import { Product } from '../models/product.js';
import { Review } from '../models/review.js';
import { User } from '../models/user.js';

const getReviewsSummary = (reviews) => {
  let totalRating = 0;
  let recommendedCount = 0;
  let reviewsCount = 0;
  const mappedRatings = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  }

  reviews.forEach(review => {
    mappedRatings[review.rating] = mappedRatings[review.rating] + 1;
    if (review.recommended) {
      recommendedCount++;
    }
    reviewsCount++;
    totalRating += review.rating;
  });

  return {
    averageRating: totalRating / reviewsCount,
    reviewsCount,
    recommendedPercentage: (recommendedCount / reviewsCount) * 100,
    ratingsBreakdown: {
      oneStarPercentage: (mappedRatings[1] / reviewsCount) * 100,
      twoStarPercentage: (mappedRatings[2] / reviewsCount) * 100,
      threeStarPercentage: (mappedRatings[3] / reviewsCount) * 100,
      fourStarPercentage: (mappedRatings[4] / reviewsCount) * 100,
      fiveStarPercentage: (mappedRatings[5] / reviewsCount) * 100,
    }
  }
}

export const addReview = async (req, res, next) => {
  const { userId } = req.user;
  const { rating, displayName, title, text, recommended, productId } = req.body;

  try {
    let user = await User.findById(userId);
    let product = await Product.findById(productId);

    if (!product) {
      res.status(500).send();
      return;
    }

    let review = await Review.findOne({
      productId,
      userId
    });

    if (review) {
      res.status(403).send({ message: 'Review for this product already exists ' });
      return;
    }

    review = new Review({
      slug: product.slug,
      rating,
      displayName,
      title,
      text,
      recommended,
      productId: product._id,
      userId
    })

    user.reviews.push(review);
    product.reviews.push(review);
    product.reviewsSummary = getReviewsSummary(product.reviews);

    review = await review.save();
    user = await user.save();
    product = await product.save();

    await user.populate('reviews')
    res.send({ reviews: product.reviews, reviewsSummary: product.reviewsSummary })
  } catch (error) {
    next(error);
  }
}

export const deleteReview = async (req, res, next) => {
  const { userId } = req.user;
  const { reviewId } = req.body;

  try {
    await Review.deleteOne({ _id: reviewId, userId });
    res.send({ status: 'ok' });
  } catch (error) {
    next(error);
  }
}