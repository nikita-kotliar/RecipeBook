import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    image: String,
    title: String,
    ingredients: String,
    instructions: String,
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema);
