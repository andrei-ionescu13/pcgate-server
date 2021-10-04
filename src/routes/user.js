import { Router } from 'express';
import { wishlistProduct, listWishlistedProducts, addToCart, getCart, deleteFromCart } from '../controllers/user.js';
import { verifyToken } from '../middleware/verify-token.js';
const route = Router();

route.post('/wishlist', verifyToken, wishlistProduct);
route.get('/wishlist', verifyToken, listWishlistedProducts);
route.post('/cart', verifyToken, addToCart);
route.get('/cart', verifyToken, getCart);
route.delete('/cart', verifyToken, deleteFromCart);

export default route;