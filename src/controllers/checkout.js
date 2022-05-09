import Stripe from 'stripe';
import { User } from '../models/user.js';
import { STRIPE_SECRET_KEY, CLIENT_URL } from '../utils/constants.js'

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const { userId } = req.user;
  const { currency } = req.body;
  const user = await User.findById(userId).populate('cartItems.product')
  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    customer: user._id,
    payment_method_types: ['card'],
    line_items: user.cartItems.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.product.name,
        },
        //change to the selected currency
        unit_amount: item.product.price,
      },
      quantity: 1,
    })),
    mode: 'payment',
    success_url: CLIENT_URL,
    cancel_url: CLIENT_URL,
  });

  res.json({ url: session.url })
}
