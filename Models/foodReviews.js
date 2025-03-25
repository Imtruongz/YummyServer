import mongoose, { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const foodReviewSchema = new Schema({
  reviewId: {
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
  reviewText: {
    type: String,
  },
  isReviewHidden: {
    type: Boolean,
    default: false,
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

export const FoodReview =
  mongoose.models.FoodReview || model("foodReviews", foodReviewSchema);
