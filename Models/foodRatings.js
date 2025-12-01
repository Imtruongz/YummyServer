import mongoose, { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const foodRatingSchema = new Schema({
  ratingId: {
    type: String,
    default: () => uuidv4(),
    unique: true,
  },
  foodId: {
    type: String,
    required: true,
    ref: 'Food'
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
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

// Unique constraint: 1 user chỉ có 1 rating trên 1 food
foodRatingSchema.index({ foodId: 1, userId: 1 }, { unique: true });

export const FoodRating =
  mongoose.models.FoodRating || model("foodRatings", foodRatingSchema);
