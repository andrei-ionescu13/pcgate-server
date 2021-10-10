import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import authRoutes from './routes/auth.js';
import checkoutRoutes from './routes/checkout.js';
import orderRoutes from './routes/order.js';
import productRoutes from './routes/product.js';
import reviewRoutes from './routes/review.js';
import userRoutes from './routes/user.js';
import { Order } from './models/order.js';
import { User } from './models/user.js';
import { MONGO_URI, PORT, STRIPE_SIGNING_SECRET, STRIPE_SECRET_KEY } from './utils/constants.js';

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
      console.log(email)
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.send();
});

app.use(express.json())
app.use(cors());
mongoose.connect(MONGO_URI);

app.use('/auth', authRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/orders', orderRoutes);
app.use('/products', productRoutes);
app.use('/reviews', reviewRoutes);
app.use('/users', userRoutes);

app.listen(port, () => { console.log('server started on port ', port) });