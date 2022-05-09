import { Product } from '../models/product.js';
import { User } from '../models/user.js';
import { getCartPrices } from '../utils/get-cart-prices.js';

export const wishlistProduct = async (req, res, next) => {
  const { userId } = req.user;
  const { productId } = req.body;
  try {
    let user = await User.findById(userId).populate('wishlist');
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }

    if (user.wishlist.map((product) => product._id.toString()).includes(product._id.toString())) {
      user.wishlist = user.wishlist.filter((_product) => _product._id.toString() !== product._id.toString());
    }
    else {
      user.wishlist.push(product._id)
    }

    user = await user.save();
    await user.populate('wishlist');
    res.send(user.wishlist);
  } catch (error) {
    next(error)
  }
}

export const listWishlistedProducts = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId);
    const products = await Product.find({
      '_id': {
        $in: user.wishlist
      }
    });

    res.send(products)

  } catch (error) {
    next(error);
  }
}

export const addToCart = async (req, res, next) => {
  const { userId } = req.user;
  const { productId } = req.body;

  try {
    const user = await User.findById(userId);

    if (user.cartItems.find((item) => item.product.toString() === productId)) {
      res.status(400).send({ message: 'Product already in the cart' });
      return;
    }

    user.cartItems.push({
      product: productId
    })

    await user.save();
    await user.populate('cartItems.product')

    res.send({
      ...getCartPrices(user.cartItems),
      items: user.cartItems
    })
  } catch (error) {
    next(error);
  }
}

export const deleteFromCart = async (req, res, next) => {
  const { userId } = req.user;
  const { productId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user.cartItems.find((item) => item.product.toString() === productId)) {
      res.status(400).send({ message: 'Product is not in the cart' });
      return;
    }

    user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId)

    await user.save();
    await user.populate('cartItems.product')

    res.send({
      ...getCartPrices(user.cartItems),
      items: user.cartItems
    })
  } catch (error) {
    next(error);
  }
}

export const getCart = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId).populate('cartItems.product');

    res.send(getCartPrices(user.cartItems))

    res.send({
      ...getCartPrices(user.cartItems),
      items: user.cartItems
    })
  } catch (error) {
    next(error);
  }
}