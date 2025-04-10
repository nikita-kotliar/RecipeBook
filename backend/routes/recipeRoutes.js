import express from "express";
import {
  createRecipe,
  getMyRecipes,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipeController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createRecipe);
router.get("/", protect, getMyRecipes);
router.put("/:id", protect, updateRecipe);
router.delete("/:id", protect, deleteRecipe);

export default router;
