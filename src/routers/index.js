import { Router } from 'express';
import usersRouter from './users.js';
import recipesRouter from './recipes.js'; // додаємо новий роутер

const router = Router();

router.use('/users', usersRouter);
router.use('/recipes', recipesRouter); // змінено з /water на /recipes

export default router;
