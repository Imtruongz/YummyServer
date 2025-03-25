import express from "express";

import { favoriteFoodsController } from "../Controllers/favoriteController.js";
import { authenticateToken } from "../Config/jwtConfig.js";

const favoriteFoodsRouter = express.Router();

favoriteFoodsRouter.get(
  "/getAll/:userId",
  authenticateToken,
  favoriteFoodsController.getAllFavoriteFoods
);
favoriteFoodsRouter.post(
  "/add",
  authenticateToken,
  favoriteFoodsController.addFavoriteFood
);
favoriteFoodsRouter.delete(
  "/delete",
  authenticateToken,
  favoriteFoodsController.deleteFavoriteFood
);

export default favoriteFoodsRouter;
