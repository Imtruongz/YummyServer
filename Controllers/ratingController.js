import {
  addOrUpdateRatingService,
  getUserRatingService,
  deleteRatingService,
  getAverageRatingService,
} from "../Services/ratingService.js";
import { Food } from '../Models/foods.js';
import { User } from '../Models/users.js';
import { sendPushNotification } from '../utils/sendPushNotification.js';
import { Notification } from '../Models/notification.js';

// Thêm hoặc cập nhật rating
export const addOrUpdateRating = async (req, res) => {
  const { foodId, userId, rating } = req.body;

  try {
    // Kiểm tra các trường bắt buộc
    if (!foodId || !userId || rating === undefined) {
      return res
        .status(400)
        .json({ message: "FoodId, userId, and rating are required." });
    }

    // Validate rating trong khoảng 1-5
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return res.status(400).json({ 
        message: "Rating must be an integer between 1 and 5." 
      });
    }

    // Kiểm tra xem user đã có rating chưa
    const existingRating = await getUserRatingService({ foodId, userId });
    const isUpdate = !!existingRating;

    // Thêm hoặc cập nhật rating
    const newRating = await addOrUpdateRatingService({
      foodId,
      userId,
      rating,
    });

    // Chỉ gửi notification khi THÊM rating mới (không phải update)
    if (!isUpdate) {
      const food = await Food.findOne({ foodId });
      if (food && food.userId !== userId) {
        const owner = await User.findOne({ userId: food.userId });
        if (owner && owner.fcmToken) {
          const title = 'Bạn có đánh giá mới!';
          const body = `Có người vừa đánh giá ${rating} sao vào món ăn của bạn.`;
          await sendPushNotification(owner.fcmToken, title, body);
          await Notification.create({
            userId: owner.userId,
            actorId: userId,
            title,
            body,
            type: 'rating',
          });
        }
      }
    }

    res.status(isUpdate ? 200 : 201).json({
      message: isUpdate ? "Rating updated successfully." : "Rating added successfully.",
      data: newRating,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy rating của user
export const getUserRating = async (req, res) => {
  const { foodId, userId } = req.params;

  try {
    if (!foodId || !userId) {
      return res.status(400).json({ message: "FoodId and userId are required." });
    }

    const rating = await getUserRatingService({ foodId, userId });
    
    if (!rating) {
      return res.status(404).json({ 
        message: "User has not rated this food yet.",
        data: null 
      });
    }

    res.status(200).json({
      message: "Rating retrieved successfully.",
      data: rating,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa rating
export const deleteRating = async (req, res) => {
  const { foodId, userId } = req.params;

  try {
    if (!foodId || !userId) {
      return res.status(400).json({ message: "FoodId and userId are required." });
    }

    const deletedRating = await deleteRatingService({ foodId, userId });
    
    if (!deletedRating) {
      return res.status(404).json({ message: "Rating not found." });
    }

    res.status(200).json({
      message: "Rating deleted successfully.",
      data: deletedRating,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy trung bình rating của 1 food
export const getAverageRating = async (req, res) => {
  const { foodId } = req.params;

  try {
    if (!foodId) {
      return res.status(400).json({ message: "FoodId is required." });
    }

    const result = await getAverageRatingService(foodId);

    res.status(200).json({
      message: "Average rating retrieved successfully.",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
