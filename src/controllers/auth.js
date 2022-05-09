import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../services/email.js'
import { Token } from '../models/token.js'
import { User } from '../models/user.js'
import { getCartPrices } from '../utils/get-cart-prices.js';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, CLIENT_URL, API_URL } from '../utils/constants.js';

export const register = async (req, res) => {
  const { email, password } = req.body;
  let user;

  try {
    user = await User.findOne({ email }).exec();
    if (user) {
      res.status(409).send({
        message: 'User with this email already exists'
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let activationToken = crypto.randomBytes(32).toString("hex");
    const hashedActivationToken = await bcrypt.hash(activationToken, 10);
    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + 7);

    user = new User({ email, password: hashedPassword });
    await user.save();

    const tokenDoc = new Token({
      user: user._id,
      token: hashedActivationToken,
      expiresAt,
      type: 'activation-token'
    });
    await tokenDoc.save()

    const link = `${API_URL}/auth/activate?token=${activationToken}&userId=${user._id}`;
    await sendEmail(user.email, 'Activate', link)
    res.json({ status: 'OK' });
  } catch (error) {
    res.status(500).send({
      message: 'Error'
    })
  }

};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(422).send({
      message: 'Wrong email/password'
    })
    return;
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    res.status(422).send({
      message: 'Wrong email/password'
    })
    return;
  }

  if (!user.active) {
    res.status(422).send({
      message: 'Please activate account'
    })
    return;
  }

  const refreshToken = jwt.sign(
    {
      userId: user.id,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d"
    }
  );
  const accessToken = jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, {
    expiresIn: "1h"
  });

  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const token = new Token({
      user: user.id,
      token: refreshToken,
      expiresAt,
      type: 'refresh-token'
    })
    await token.save();
  } catch (error) {
    return res.status(500);
  }

  res.cookie('accessToken', accessToken, { maxAge: 24 * 60 * 1000, httpOnly: true });
  res.cookie('refreshToken', refreshToken, { maxAge: 7 * 24 * 60 * 1000, httpOnly: true });
  res.send({ status: 'ok' })
};

export const requestAccessToken = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(403).send({ message: 'Refresh token required' });
  }

  try {
    const { userId } = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const refreshTokenDoc = await Token.findOne({
      token: refreshToken,
      user: userId
    }).exec();

    if (!refreshTokenDoc || refreshTokenDoc.expiresAt < Date.now()) {
      return res.status(401).send({ message: 'Invalid refresh token' })
    }

    const accessToken = jwt.sign({ userId: userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: "1h"
    });

    res.cookie('accessToken', accessToken, { maxAge: 24 * 60 * 1000, httpOnly: true });
    res.json({ status: 'ok' });
  } catch (err) {
    return res.status(401).send({ message: 'Invalid refresh token' })
  }
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).res({ message: 'User not found' })
    };

    let token = await Token.findOne({ userId: user._id, type: 'password-reset-token' });

    if (token) await token.deleteOne();

    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 10);
    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + 7);

    const tokenDoc = new Token({
      user: user._id,
      token: hash,
      expiresAt,
      type: 'password-reset-token'
    });
    await tokenDoc.save()

    const link = `${CLIENT_URL}/password-reset?token=${resetToken}&userId=${user._id}`;
    await sendEmail(user.email, 'Reset', link)

    res.send({ tokenDoc, resetToken })
  } catch (error) {
    next(error)
  }

}

export const me = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId).select('_id email wishlist cartItems').populate('wishlist cartItems.product').lean();

    res.send({
      ...user,
      cart: {
        ...getCartPrices(user.cartItems),
        items: user.cartItems
      }
    })
  } catch (error) {
    return next(error);
  }
}

export const passwordReset = async (req, res, next) => {
  try {
    const { userId, token, password } = req.body;

    let passwordResetToken = await Token.findOne({ userId, type: 'password-reset-token' });
    if (!passwordResetToken) {
      res.status(404).send({ message: 'Invalid or expired password reset token' })
      return;
    }
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
      res.status(404).send({ message: 'Invalid or expired password reset token' })
      return;
    }
    const hash = await bcrypt.hash(password, 10);
    await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );

    await passwordResetToken.deleteOne();
    res.status(200).send('Changed');
  } catch (error) {
    next(error)
  }
}

export const activate = async (req, res, next) => {
  const { userId, token } = req.query;
  console.log({ userId, token })
  if (!userId || !token) {
    res.status(500).send();
    return;
  }

  try {
    let activateToken = await Token.findOne({ userId, type: 'activation-token' });
    if (!activateToken) {
      res.status(500).send({ message: 'Invalid or expired activation token' })
    }
    const isValid = await bcrypt.compare(token, activateToken.token);
    if (!isValid) {
      res.status(500).send({ message: 'Invalid or expired activation token' })
    }
    await User.updateOne(
      { _id: userId },
      { $set: { active: true } },
      { new: true }
    );
    await activateToken.deleteOne();

    res.redirect(`${CLIENT_URL}/login`);
  } catch (error) {
    next(error);
  }
}

export const logout = async (req, res, next) => {
  console.log('logout')
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.send({ status: 'ok' })
}