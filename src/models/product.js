import mongoose from 'mongoose';
import { Currency } from './currency.mjs';
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
  fullPrice: Number,
  publishers: [String],
  release: Date,
  type: String,
  video: [String],
  desc: String,
  price: Number,
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

const getPrices = (product, currencies) => {
  const price = product.price;
  const fullPrice = product.fullPrice;
  const priceMap = {};
  const fullPriceMap = {};

  for (const currency of currencies) {
    const currencyCode = currency.code;
    const pricePerCurrency = price * currency.rate / 100;
    const fullPricePerCurrency = fullPrice * currency.rate / 100;

    priceMap[currencyCode] = pricePerCurrency;
    fullPriceMap[currencyCode] = fullPricePerCurrency;
  }

  return { priceMap, fullPriceMap };

}

productSchema.post('findOne', async function (product) {
  const currencies = await Currency.find({});
  const { priceMap, fullPriceMap } = getPrices(product, currencies);

  product.price = priceMap;
  product.fullPrice = fullPriceMap;
});

productSchema.post('find', async function (products) {
  const currencies = await Currency.find({});

  for (const product of products) {
    const { priceMap, fullPriceMap } = getPrices(product, currencies);
    product.price = priceMap;
    product.fullPrice = fullPriceMap;
  }
});

productSchema.post('aggregate', async function (doc) {
  const currencies = await Currency.find({});

  for (const product of doc[0].products) {
    const { priceMap, fullPriceMap } = getPrices(product, currencies);
    product.price = priceMap;
    product.fullPrice = fullPriceMap;
  }
})


export const Product = mongoose.model('Product', productSchema);