import { favoriteFoodsService } from "../Services/favoriteService.js";

export const favoriteFoodsController = {
  getAllFavoriteFoods: async (req, res) => {
    try {
        const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const favoriteFoods = await favoriteFoodsService.getAllFavoriteFoods(
        userId
      );
      res.status(200).json({ data: favoriteFoods });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addFavoriteFood: async (req, res) => {
    try {
      const { userId, foodId } = req.body;
      if (!userId || !foodId) {
        return res
          .status(400)
          .json({ message: "User ID and Food ID are required" });
      }
      const newFavorite = await favoriteFoodsService.addFavoriteFood({
        userId,
        foodId,
      });
      res
        .status(201)
        .json({
          message: "Favorite food added successfully",
          data: newFavorite,
        });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteFavoriteFood: async (req, res) => {
    try {
      const { userId, favoriteFoodId } = req.body;
      if (!userId || !favoriteFoodId) {
        return res
          .status(400)
          .json({ message: "User ID and Favorite Food ID are required" });
      }
      const deletedFavorite = await favoriteFoodsService.deleteFavoriteFood({
        userId,
        favoriteFoodId,
      });
      res
        .status(200)
        .json({
          message: "Favorite food deleted successfully",
          data: deletedFavorite,
        });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
