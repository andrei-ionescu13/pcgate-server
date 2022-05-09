import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../utils/constants.js';

export const verifyToken = (req, res, next) => {
  const { accessToken } = req.cookies;
  console.log(req.cookies, req.baseUrl)

  if (!accessToken) {
    return res.status(401).send({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).send({ message: 'Invalid access token' })
  }
};
