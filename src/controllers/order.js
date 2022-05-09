import { Order } from '../models/order.js';
import { User } from '../models/user.js';

export const listOrders = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId).populate('orders');
    res.send(user.orders);
  } catch (error) {
    next(error)
  }
}

export const getOrder = async (req, res, next) => {
  const { userId } = req.user;
  const { id } = req.params;

  try {
    const order = await Order.findOne({ _id: id, user: userId });
    res.send(order);
  } catch (error) {
    next(error)
  }
}