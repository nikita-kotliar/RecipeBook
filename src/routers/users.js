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
} from '../controllers/users.js';
// import express from "express";
import passport from "passport";
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
// import passport from 'passport';
const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Колбек після авторизації
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    session: true,
  }),
  (req, res) => {
    res.redirect('http://localhost:5173'); // або localhost:5173
    
  }
);

// Повернути поточного користувача
router.get('/me', (req, res) => {
  res.json(req.user || null);
});


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
