import Joi from 'joi';

export const createRecipeSchema = Joi.object({
  title: Joi.string().min(3).required().messages({
    'string.base': 'The title should be a string.',
    'string.min': 'The title should have at least 3 characters.',
    'any.required': 'The title is required.',
  }),
  image: Joi.string().uri().required().messages({
    'string.base': 'The image URL should be a string.',
    'string.uri': 'The image should be a valid URL.',
    'any.required': 'The image URL is required.',
  }),
  ingredients: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .required()
    .messages({
      'array.base': 'Ingredients should be an array of strings.',
      'array.min': 'There must be at least one ingredient.',
      'any.required': 'Ingredients are required.',
    }),
  instructions: Joi.string().min(10).required().messages({
    'string.base': 'Instructions should be a string.',
    'string.min': 'Instructions should be at least 10 characters long.',
    'any.required': 'Instructions are required.',
  }),
  notes: Joi.string().optional().messages({
    'string.base': 'Notes should be a string.',
  }),
  isFavorite: Joi.boolean().optional().messages({
    'boolean.base': 'The isFavorite should be a boolean value.',
  }),
});
