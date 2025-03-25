import { FavoriteFood } from "../Models/favoriteFoods.js";

export const favoriteFoodsService = {
  getAllFavoriteFoods: async (userId) => {
    try {
      return await FavoriteFood.find({ userId });
    } catch (error) {
      throw new Error(`Error fetching favorite foods: ${error.message}`);
    }
  },

  addFavoriteFood: async ({ userId, foodId }) => {
    try {
      if (!userId || !foodId) {
        throw new Error("User ID and Food ID are required");
      }
      const existingFavorite = await FavoriteFood.findOne({ userId, foodId });
      if (existingFavorite) {
        throw new Error("Food is already in favorite list");
      }

      const newFavoriteFood = new FavoriteFood({ userId, foodId });
      await newFavoriteFood.save();
      return newFavoriteFood;
    } catch (error) {
      throw new Error(`Error adding favorite food: ${error.message}`);
    }
  },

  deleteFavoriteFood: async ({ userId, favoriteFoodId }) => {
    try {
      const result = await FavoriteFood.findOneAndDelete({
        userId,
        favoriteFoodId,
      });
      if (!result) {
        throw new Error("Favorite food not found or cannot be deleted");
      }
      return result;
    } catch (error) {
      throw new Error(`Error deleting favorite food: ${error.message}`);
    }
  },
};
