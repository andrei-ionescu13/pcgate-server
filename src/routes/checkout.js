import { Router } from 'express';
import { createCheckoutSession } from '../controllers/checkout.js';
import { verifyToken } from '../middleware/verify-token.js';
const route = Router();

route.post('/', verifyToken, createCheckoutSession);

export default route;