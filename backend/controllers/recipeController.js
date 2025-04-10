import Recipe from "../models/Recipe.js";

export const createRecipe = async (req, res) => {
  const recipe = await Recipe.create({ ...req.body, user: req.user.id });
  res.json(recipe);
};

export const getMyRecipes = async (req, res) => {
  const recipes = await Recipe.find({ user: req.user.id });
  res.json(recipes);
};

export const updateRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (recipe.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  Object.assign(recipe, req.body);
  await recipe.save();
  res.json(recipe);
};

export const deleteRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (recipe.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Access denied" });
  }

  await recipe.deleteOne();
  res.json({ message: "Recipe deleted" });
};
