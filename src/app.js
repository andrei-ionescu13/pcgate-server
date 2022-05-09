import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import fetch from 'node-fetch';
import schedule from 'node-schedule';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import checkoutRoutes from './routes/checkout.js';
import orderRoutes from './routes/order.js';
import productRoutes from './routes/product.js';
import reviewRoutes from './routes/review.js';
import userRoutes from './routes/user.js';
import { Order } from './models/order.js';
import { User } from './models/user.js';
import { Currency } from './models/currency.mjs';
import { MONGO_URI, PORT, STRIPE_SIGNING_SECRET, STRIPE_SECRET_KEY, OPEN_EXCHANGE_RATES_APP_ID } from './utils/constants.js';

const port = PORT || 3001;
const app = express();
const stripe = new Stripe(STRIPE_SECRET_KEY);

app.post('/webhook', express.raw({ type: "*/*" }), async (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, STRIPE_SIGNING_SECRET);
  } catch (err) {
    console.log(err)
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case 'charge.succeeded':
      const { amount, currency } = event.data.object;
      const { email } = event.data.object.billing_details;
      const user = await User.findOne({ email }).populate('cartItems.product');
      const order = new Order({
        user,
        items: user.cartItems,
        amount,
        currency: currency.toUpperCase()
      })
      await order.save();
      await User.updateOne(
        { email },
        {
          $set: { cartItems: [] },
          $push: { orders: order }
        },
        { new: true }
      );
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.send();
});


const job = schedule.scheduleJob('*/50 * * * *', async () => {
  try {
    const currencies = await Currency.find({});
    const response = await fetch(`https://openexchangerates.org/api/latest.json?app_id=${OPEN_EXCHANGE_RATES_APP_ID}`);
    const data = await response.json();

    for (const currency of currencies) {
      currency.rate = data.rates[currency.code];
    }

    await Promise.all(currencies.map((currency) => currency.save()))
  } catch (error) {
    console.log(error);
  }
});

app.get('/currencies', async (req, res) => {

  res.json(currencies);
})

app.use(cookieParser());
app.use(express.json())
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
mongoose.connect(MONGO_URI);

app.use('/auth', authRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/orders', orderRoutes);
app.use('/products', productRoutes);
app.use('/reviews', reviewRoutes);
app.use('/users', userRoutes);

app.listen(port, () => { console.log('server started on port ', port) });