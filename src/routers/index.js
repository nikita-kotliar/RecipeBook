import { Router } from 'express';
import usersRouter from './users.js';
import recipesRouter from './recipes.js'; 

const router = Router();

router.use('/users', usersRouter);
router.use('/recipes', recipesRouter); 

export default router;
