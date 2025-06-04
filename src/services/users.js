import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import User from '../db/models/user.js';

import { generateTokens } from '../utils/generateTokens.js';
import createHttpError from 'http-errors';
import crypto from 'crypto';



export const registerUser = async (data) => {
  const { email, password } = data;
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const generatedAvatar = gravatar.url(email);
  const verificationToken = crypto.randomUUID();

  return await User.create({
    email,
    password: hashPassword,
    avatarURL: `http:${generatedAvatar}`,
    verificationToken,
  });
};


export const loginUser = async (email, password) => {
  const existedUser = await User.findOne({ email });
  if (!existedUser) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const isMatch = await bcrypt.compare(password, existedUser.password);
  if (!isMatch) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const tokens = generateTokens(existedUser);

  await User.findByIdAndUpdate(existedUser._id, { token: tokens.accessToken });

  return { user: existedUser, tokens };
};

export const logoutUser = async (refreshToken) => {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {}
  if (decoded) await User.findByIdAndUpdate(decoded.id, { token: null });
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId, 'name photo email about password');

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const maskedPassword = user.password === null ? false : true;


  return {
    ...user.toObject(),
    password: maskedPassword,
  };
};


export const updateUserDetails = async (userId, data) => {
  if (!data.password?.trim()) {
    delete data.password; 
  } else {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const result = await User.findByIdAndUpdate(
    userId,
    { $set: data },
    {
      new: true,
      fields: 'name photo email about password'
    }
  );

  if (!result) {
    throw createHttpError(404, 'User not found');
  }

  const maskedPassword = result.password === null ? false : true;

  // return result;
  return {
    ...result.toObject(),
    password: maskedPassword,
  };
};




export const verifyUserEmail = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  await User.findOneAndUpdate(
    { _id: user._id },
    { verify: true, verificationToken: null },
  );
};


export const refreshUserSession = async (refreshToken) => {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  const tokens = generateTokens(user);

  await User.findByIdAndUpdate(user._id, { token: tokens.accessToken });

  return tokens;
};

export const getUserCountService = async () => {
  return await User.countDocuments();
};

export const uploadAvatarService = async (userId, urlPhoto) => {
  const { value } = await User.findByIdAndUpdate(
    { _id: userId },
    { photo: urlPhoto },
    { new: true, includeResultMetadata: true },
  );

  return { photo: value.photo };
};
