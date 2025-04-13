import { Router } from 'express';
import {
  register,
  login,
  logout,
  currentUser,
  updateUser,
  verifyEmail,
  resendVerifyEmail,
  uploadAvatar,
  getUserCount,
  refreshTokens,
  googleAuth,
  googleRedirect,
} from '../controllers/users.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserSchema,
  registerUserSchema,
  resendVerifySchema,
  userSchema,
} from '../validation/userSchema.js';
import { checkAuth } from '../middlewares/checkAuth.js';
import uploadMiddleware from '../middlewares/upload.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/google', ctrlWrapper(googleAuth));
router.get('/google-redirect', ctrlWrapper(googleRedirect));

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(register),
);

router.post('/login', validateBody(loginUserSchema), ctrlWrapper(login));

router.post('/refresh', ctrlWrapper(refreshTokens));

router.post('/logout', ctrlWrapper(logout));

router.get('/info', checkAuth, ctrlWrapper(currentUser));

router.patch(
  '/photo',
  checkAuth,
  uploadMiddleware.single('avatar'),
  ctrlWrapper(uploadAvatar),
);

router.patch(
  '/info',
  checkAuth,
  validateBody(userSchema),
  ctrlWrapper(updateUser),
);

router.get('/count', ctrlWrapper(getUserCount));

router.get('/verify/:verificationToken', ctrlWrapper(verifyEmail));
router.post(
  '/verify',
  validateBody(resendVerifySchema),
  ctrlWrapper(resendVerifyEmail),
);

export default router;
