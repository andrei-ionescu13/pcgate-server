import mongoose from 'mongoose';
const { Schema } = mongoose;

const tokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  type: { type: String, enum: ['refresh-token', 'password-reset-token', 'activation-token'] }
});

export const Token = mongoose.model('Token', tokenSchema);
