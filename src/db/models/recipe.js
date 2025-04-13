import { model, Schema } from 'mongoose';

const recipeSchema = new Schema(
  {
    title: { type: String, required: true },
    photo: { type: String },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
    notes: { type: String, default: '' },
    isFavorite: { type: Boolean, default: false },
    owner: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const RecipeCollection = model('recipes', recipeSchema);
