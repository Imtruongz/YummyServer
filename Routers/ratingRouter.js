import express from "express";
import {
  addOrUpdateRating,
  getUserRating,
  deleteRating,
  getAverageRating,
} from "../Controllers/ratingController.js";
import { authenticateToken } from "../Config/jwtConfig.js";

const ratingRouter = express.Router();

// POST - Thêm hoặc cập nhật rating
ratingRouter.post("/addOrUpdate", authenticateToken, addOrUpdateRating);

// GET - Lấy rating của user cho 1 food
ratingRouter.get("/getUserRating/:foodId/:userId", getUserRating);

// GET - Lấy trung bình rating của 1 food
ratingRouter.get("/getAverageRating/:foodId", getAverageRating);

// DELETE - Xóa rating
ratingRouter.delete("/delete/:foodId/:userId", authenticateToken, deleteRating);

export default ratingRouter;
