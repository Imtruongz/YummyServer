import mongoose, {model, Schema} from "mongoose";
import {v4 as uuidv4} from "uuid";

const favoriteFoodSchema = new Schema({
    favoriteFoodId: {
        type: String,
        default: () => uuidv4(),
        unique: true
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export const FavoriteFood = mongoose.models.FavoriteFood || model("FavoriteFood", favoriteFoodSchema);