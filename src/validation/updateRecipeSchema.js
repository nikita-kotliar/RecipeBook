import Joi from 'joi';

export const updateRecipeSchema = Joi.object({
  title: Joi.string().min(3).messages({
    'string.base': 'The title should be a string.',
    'string.min': 'The title should have at least 3 characters.',
  }),
  image: Joi.string().uri().messages({
    'string.base': 'The image URL should be a string.',
    'string.uri': 'The image should be a valid URL.',
  }),
  ingredients: Joi.array().items(Joi.string().required()).min(1).messages({
    'array.base': 'Ingredients should be an array of strings.',
    'array.min': 'There must be at least one ingredient.',
  }),
  instructions: Joi.string().min(10).messages({
    'string.base': 'Instructions should be a string.',
    'string.min': 'Instructions should be at least 10 characters long.',
  }),
  notes: Joi.string().optional().messages({
    'string.base': 'Notes should be a string.',
  }),
  isFavorite: Joi.boolean().messages({
    'boolean.base': 'The isFavorite should be a boolean value.',
  }),
})
  .min(1)
  .messages({
    'object.min': 'You must specify at least one field to update.',
  });
