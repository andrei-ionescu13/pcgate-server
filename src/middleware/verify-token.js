import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../utils/constants.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["access-token"];
  if (!authHeader) {
    return res.status(403).send({ message: 'Access token required' });
  }

  const accessToken = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send({ message: 'Invalid access token' })
  }
};
