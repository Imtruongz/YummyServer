import mongoose, { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const categorySchema = new Schema({
  categoryId: {
    type: String,
    default: () => uuidv4(),
    unique: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
  categoryThumbnail: {
    type: String,
    required: true,
  },
});

export const Category =
  mongoose.models.Category || model("categories", categorySchema);
