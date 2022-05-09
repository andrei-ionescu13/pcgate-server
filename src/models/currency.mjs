import mongoose from 'mongoose';
const { Schema } = mongoose;

const currencySchema = new Schema({
  currency: String,
  symbol: String,
  rate: Number,
  code: String
});

export const Currency = mongoose.model('Currency', currencySchema);
