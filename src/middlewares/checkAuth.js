import jwt from 'jsonwebtoken';
import User from '../db/models/user.js';
import createHttpError from 'http-errors';
import { promisify } from 'util';

const verifyToken = promisify(jwt.verify);

export const checkAuth = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    console.log('Authorization Header:', authorizationHeader); // Логування заголовка

    if (!authorizationHeader) {
      return next(createHttpError(401, 'Not authorized: No Authorization Header'));
    }

    const [bearer, token] = authorizationHeader.split(' ', 2);
    console.log('Bearer:', bearer, 'Token:', token); // Логування розбитого заголовка

    if (bearer !== 'Bearer' || !token) {
      return next(createHttpError(401, 'Not authorized: Invalid Header Format'));
    }

    const decoded = await verifyToken(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded); // Логування розшифрованого токена

    const user = await User.findById(decoded.id);
    console.log('User found:', user); // Логування користувача

    if (!user || user.token !== token) {
      return next(createHttpError(401, 'Not authorized: User or token mismatch'));
    }

    req.user = {
      id: decoded.id,
      email: user.email,
      name: user.name,
      about: user.about,
      photo: user.photo,
    };

    next();
  } catch (error) {
    return next(createHttpError(401, 'Not authorized: Token verification failed'));
  }
};
