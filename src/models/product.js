import mongoose from 'mongoose';
const { Schema } = mongoose;

export const productSchema = new Schema({
  cover: String,
  drm_string: String,
  drm: {
    voucher: Boolean,
    redeem: Boolean,
    utalk: Boolean,
    zenva: Boolean,
    magix: Boolean,
    gog: Boolean,
    threeds: Boolean,
    switch: Boolean,
    epicgames: Boolean,
    bethesda: Boolean,
    oculus: Boolean,
    uplay: Boolean,
    esonline: Boolean,
    rockstar: Boolean,
    origin: Boolean,
    steam: Boolean,
    drm_free: Boolean
  },
  name: String,
  slug: String,
  title: String,
  developers: [String],
  franchises: [String],
  genres: [String],
  display_type: String,
  img: [{
    order: String,
    alt: String,
    slug: String,
  }],
  lang: [String],
  platform_specs: {
    win: {
      min: String,
      rec: String
    },
    linux: {
      min: String,
      rec: String
    },
    mac: {
      min: String,
      rec: String
    },
  },
  platforms: {
    linux: {
      type: Boolean,
      default: false
    },
    mac: {
      type: Boolean,
      default: false
    },
    windows: {
      type: Boolean,
      default: false
    }
  },
  price: {
    JPY: Number,
    RUB: Number,
    AUD: Number,
    CAD: Number,
    EUR: Number,
    USD: Number,
    GBP: Number
  },
  publishers: [String],
  release: Date,
  type: String,
  video: [String],
  desc: String,
  currentPrice: {
    JPY: Number,
    RUB: Number,
    AUD: Number,
    CAD: Number,
    EUR: Number,
    USD: Number,
    GBP: Number
  },
  current_discount: {
    percent: Number,
    display_percentage: Boolean,
    until: Date,
    from: Date,
    best_ever: Boolean,
    flash_sale: Boolean,
    hide_timer: Boolean,
    highlighted: Boolean
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review', default: [] }],
  reviewsSummary: {
    averageRating: Number,
    reviewsCount: Number,
    recommendedPercentage: Number,
    ratingsBreakdown: {
      oneStarPercentage: Number,
      twoStarPercentage: Number,
      threeStarPercentage: Number,
      fourStarPercentage: Number,
      fiveStarPercentage: Number
    }
  }
});

export const Product = mongoose.model('Product', productSchema);