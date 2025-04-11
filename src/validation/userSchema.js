import Joi from 'joi';

// Схема реєстрації користувача
export const registerUserSchema = Joi.object({
  password: Joi.string().min(1).required(),
  email: Joi.string().email().trim().lowercase().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Email must be a valid email',
    'string.empty': 'Email cannot be empty',
  }),
  about: Joi.string().max(500).optional().messages({
    'string.base': 'About must be a string.',
    'string.max': 'About cannot be more than 500 characters.',
  }),
});

// Схема входу користувача
export const loginUserSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().trim().lowercase().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Email must be a valid email',
    'string.empty': 'Email cannot be empty',
  }),
});

// Схема редагування даних користувача
export const userSchema = Joi.object({
  email: Joi.string().email(),
  name: Joi.string().trim(),
  about: Joi.string().max(500).optional().messages({
    'string.base': 'About must be a string.',
    'string.max': 'About cannot be more than 500 characters.',
  }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be filled',
  });

// Схема для повторного надсилання підтвердження email
export const resendVerifySchema = Joi.object({
  email: Joi.string().email().required(),
}).messages({ message: 'Missing required field email' });
