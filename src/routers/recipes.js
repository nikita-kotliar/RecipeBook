import { Router } from 'express';
import {
  createRecipeController,
  getRecipeByIdController,
  updateRecipeController,
  deleteRecipeController,
  getAllRecipesController,
  getFavoriteRecipesController,
  uploadImage,
} from '../controllers/recipes.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateMongoId } from '../middlewares/validateMongoId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createRecipeSchema } from '../validation/createRecipeSchema.js';
import { updateRecipeSchema } from '../validation/updateRecipeSchema.js';
import { checkAuth } from '../middlewares/checkAuth.js';
import uploadMiddleware from '../middlewares/upload.js';

const router = Router();

router.use(checkAuth);

router.post(
  '/',
  checkAuth,
  validateBody(createRecipeSchema),
  ctrlWrapper(createRecipeController),
);

router.get('/', ctrlWrapper(getAllRecipesController));

router.get('/:id', validateMongoId('id'), ctrlWrapper(getRecipeByIdController));

router.patch(
  '/image',
  checkAuth,
  uploadMiddleware.single('image'),
  ctrlWrapper(uploadImage),
);

router.patch(
  '/:id',
  validateBody(updateRecipeSchema),
  validateMongoId('id'),
  ctrlWrapper(updateRecipeController),
);

router.delete(
  '/:id',
  validateMongoId('id'),
  ctrlWrapper(deleteRecipeController),
);


router.get('/favorites/all', ctrlWrapper(getFavoriteRecipesController));

export default router;
