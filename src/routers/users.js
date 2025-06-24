import { Router } from 'express';
import {
  register,
  login,
  logout,
  currentUser,
  updateUser,
  uploadAvatar,
  getUserCount,
  refreshTokens,
} from '../controllers/users.js';
import passport from "passport";
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserSchema,
  registerUserSchema,
  userSchema,
} from '../validation/userSchema.js';
import { checkAuth } from '../middlewares/checkAuth.js';
import uploadMiddleware from '../middlewares/upload.js';
import User from "../db/models/user.js";
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { generateTokens } from '../utils/generateTokens.js';
const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    session: true,
  }),
  async (req, res) => {
    try {
      const user = req.user; 
      const existedUser = await User.findOne({ email: user.email });
      const tokens = generateTokens(existedUser); 

      await User.findByIdAndUpdate(existedUser._id, { token: tokens.accessToken });

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
        expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      });

      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: false,
        sameSite: 'strict', // або 'strict'
        secure: false,   // вимкнено secure для localhost
        expires: new Date(Date.now() + 15 * 60 * 1000),
      });
      

      res.redirect(
        `https://recipe-book-git-main-nikita-kotliars-projects.vercel.app/google-success?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`,
      );

    } catch (err) {
      console.error('Google callback error:', err);
      res.redirect(
        'https://recipe-book-git-main-nikita-kotliars-projects.vercel.app/*',
      ); 
    }
  }
);

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


export default router;
