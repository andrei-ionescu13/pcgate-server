import { Router } from 'express';
import { requestAccessToken, register, login, me, requestPasswordReset, passwordReset, activate } from '../controllers/auth.js';
import { validate } from '../middleware/validate.js'
import { verifyToken } from '../middleware/verify-token.js';
import { loginSchema, registerSchema, requestPasswordResetSchema, passwordResetSchema } from '../validation/auth.js';
const route = Router();

route.post('/register', validate(registerSchema), register)
route.post('/login', validate(loginSchema), login)
route.get('/access-token', requestAccessToken)
route.get('/me', verifyToken, me)
route.post('/password-recovery', validate(requestPasswordResetSchema), requestPasswordReset)
route.post('/password-reset', validate(passwordResetSchema), passwordReset)
route.get('/activate', activate)

export default route;