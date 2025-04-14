import { RecipeCollection } from '../db/models/recipe.js';

export const createRecipe = async (payload) => {
  const {
    title,
    image = '',
    ingredients,
    instructions,
    notes = '',
    isFavorite = false,
    userId,
  } = payload;

  console.log('Payload:', payload);
  console.log('User ID:', userId);

  const recipe = await RecipeCollection.create({
    title,
    image,
    ingredients,
    instructions,
    notes,
    isFavorite,
    owner: userId,
  });

  const { _id, owner, ...other } = recipe._doc;
  return { id: _id, ...other };
};

export const getRecipeById = async (recipeId, userId) => {
  const recipe = await RecipeCollection.findOne({
    _id: recipeId,
    owner: userId,
  });
  if (!recipe) return null;

  const { _id, owner, ...other } = recipe._doc;
  return { id: _id, ...other };
};

export const updateRecipeById = async (recipeId, userId, payload) => {
  const updatedRecipe = await RecipeCollection.findOneAndUpdate(
    { _id: recipeId, owner: userId },
    payload,
    { new: true },
  );

  if (!updatedRecipe) return null;

  const { _id, owner, ...other } = updatedRecipe._doc;
  return { id: _id, ...other };
};

export const deleteRecipeById = async (recipeId, userId) => {
  const deleted = await RecipeCollection.findOneAndDelete({
    _id: recipeId,
    owner: userId,
  });
  if (!deleted) return null;

  const { _id, owner, ...other } = deleted._doc;
  return { id: _id, ...other };
};

export const getAllRecipesByUser = async (userId) => {
  const recipes = await RecipeCollection.find({ owner: userId }).lean();
  return recipes.map(({ _id, owner, ...rest }) => ({ id: _id, ...rest }));
};

export const getFavoriteRecipes = async (userId) => {
  const favorites = await RecipeCollection.find({
    owner: userId,
    isFavorite: true,
  }).lean();
  return favorites.map(({ _id, owner, ...rest }) => ({ id: _id, ...rest }));
};
