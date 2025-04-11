import { Router } from 'express';
import {
  createRecipeController,
  getRecipeByIdController,
  updateRecipeController,
  deleteRecipeController,
  getAllRecipesController,
  getFavoriteRecipesController,
} from '../controllers/recipes.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateMongoId } from '../middlewares/validateMongoId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createRecipeSchema } from '../validation/createRecipeSchema.js';
import { updateRecipeSchema } from '../validation/updateRecipeSchema.js';
import { checkAuth } from '../middlewares/checkAuth.js';

const router = Router();

router.use(checkAuth);

// Створити рецепт
router.post(
  '/',
  validateBody(createRecipeSchema),
  ctrlWrapper(createRecipeController),
);

// Отримати всі рецепти користувача
router.get('/', ctrlWrapper(getAllRecipesController));

// Отримати рецепт за id
router.get('/:id', validateMongoId('id'), ctrlWrapper(getRecipeByIdController));

// Оновити рецепт
router.patch(
  '/:id',
  validateBody(updateRecipeSchema),
  validateMongoId('id'),
  ctrlWrapper(updateRecipeController),
);

// Видалити рецепт
router.delete(
  '/:id',
  validateMongoId('id'),
  ctrlWrapper(deleteRecipeController),
);

// Отримати улюблені рецепти
router.get('/favorites/all', ctrlWrapper(getFavoriteRecipesController));

export default router;
