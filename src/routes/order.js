import { Router } from 'express';
import { listOrders, getOrder } from '../controllers/order.js';
import { verifyToken } from '../middleware/verify-token.js';
const route = Router();

route.get('/', verifyToken, listOrders);
route.get('/:id', verifyToken, getOrder);

export default route;