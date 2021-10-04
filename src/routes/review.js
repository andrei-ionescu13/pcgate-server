import { Router } from 'express';
import { addReview, deleteReview } from '../controllers/review.js';
import { verifyToken } from '../middleware/verify-token.js';
const route = Router();

route.post('/', verifyToken, addReview);
route.delete('/', verifyToken, deleteReview);

export default route;