import createHttpError from 'http-errors';
import {
  createRecipe,
  getRecipeById,
  updateRecipeById,
  deleteRecipeById,
  getAllRecipesByUser,
} from '../services/recipes.js';
export const createRecipeController = async (req, res) => {
  console.log('req.user:', req.user);
  const data = {
    ...req.body,
    owner: req.user.id,
  };

  console.log('payload:', payload);

  const recipe = await createRecipe(data);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a recipe!',
    data: recipe,
  });
};

export const getRecipeByIdController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const recipe = await getRecipeById(id, userId);

  if (!recipe) {
    return next(createHttpError(404, 'Recipe not found'));
  }

  res.status(200).json({
    status: 200,
    message: `Found recipe with id ${id}`,
    data: recipe,
  });
};

export const updateRecipeController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const updated = await updateRecipeById(id, userId, req.body);

  if (!updated) {
    return next(createHttpError(404, 'Recipe not found'));
  }

  res.status(200).json({
    status: 200,
    message: 'Recipe updated successfully!',
    data: updated,
  });
};

export const deleteRecipeController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const deleted = await deleteRecipeById(id, userId);

  if (!deleted) {
    return next(createHttpError(404, 'Recipe not found'));
  }

  res.status(200).json({
    status: 200,
    message: 'Recipe deleted successfully!',
    data: deleted,
  });
};

export const getAllRecipesController = async (req, res) => {
  const userId = req.user.id;

  const recipes = await getAllRecipesByUser(userId);

  res.status(200).json({
    status: 200,
    message: 'Successfully fetched recipes!',
    data: recipes,
  });
};
export const getFavoriteRecipesController = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const favoriteRecipes = await getFavoriteRecipes(userId);

    if (!favoriteRecipes || favoriteRecipes.length === 0) {
      return next(createHttpError(404, 'No favorite recipes found.'));
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully fetched favorite recipes!',
      data: favoriteRecipes,
    });
  } catch (error) {
    next(createHttpError(500, 'Internal Server Error'));
  }
};