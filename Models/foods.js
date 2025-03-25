import mongoose, { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const foodSchema = new Schema({
  foodId: {
    type: String,
    default: () => uuidv4(),
    unique: true,
  },
  foodName: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
    ref: 'Category'
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  foodDescription: {
    type: String,
    required: true,
  },
  foodIngredients: {
    type: [String],
    required: true,
  },
  foodThumbnail: {
    type: String,
    required: true,
  },
  foodSteps: {
    type: [String],
  },
  CookingTime: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Food = mongoose.models.Food || model("Food", foodSchema);
