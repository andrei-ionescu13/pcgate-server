import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string()
    .max(255)
    .email()
    .required(),
  password: Joi.string().max(255).required(),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required()
})

export const loginSchema = Joi.object({
  email: Joi.string()
    .max(255)
    .email()
    .required(),
  password: Joi.string().max(255)
})

export const requestPasswordResetSchema = Joi.object({
  email: Joi.string()
    .max(255)
    .email()
    .required()
})

export const passwordResetSchema = Joi.object({
  password: Joi.string().max(255).required(),
  userId: Joi.string().max(255).required(),
  token: Joi.string().max(255).required(),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required()
})