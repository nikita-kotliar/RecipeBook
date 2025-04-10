import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  updateProfile,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getCurrentUser);
router.post("/logout", protect, logoutUser);
router.put("/me", protect, updateProfile);

export default router;
