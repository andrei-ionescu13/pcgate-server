import { Router } from 'express';
import {
  listProducts,
  getProductBySlug,
  listBestSellers,
  getHighlightedProduct,
  insertProducts
} from '../controllers/product.js';
const route = Router();

route.post('/', listProducts);
route.post('/insert', insertProducts);
route.get('/best-sellers', listBestSellers);
route.get('/slug/:slug', getProductBySlug);
route.get('/highlighted/:tag', getHighlightedProduct);

export default route;