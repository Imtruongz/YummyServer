import { FoodRating } from "../Models/foodRatings.js";

// Thêm hoặc cập nhật rating
export const addOrUpdateRatingService = async ({ foodId, userId, rating }) => {
  try {
    // Kiểm tra xem user đã đánh giá food này chưa
    const existingRating = await FoodRating.findOne({ foodId, userId });

    if (existingRating) {
      // Update rating cũ
      existingRating.rating = rating;
      existingRating.updatedAt = new Date();
      await existingRating.save();
      return existingRating;
    } else {
      // Tạo rating mới
      const newRating = new FoodRating({
        foodId,
        userId,
        rating,
      });
      await newRating.save();
      return newRating;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Lấy rating của user cho 1 food
export const getUserRatingService = async ({ foodId, userId }) => {
  try {
    const rating = await FoodRating.findOne({ foodId, userId });
    return rating;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Xóa rating
export const deleteRatingService = async ({ foodId, userId }) => {
  try {
    const deletedRating = await FoodRating.findOneAndDelete({ foodId, userId });
    return deletedRating;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Tính trung bình rating của 1 dish
export const getAverageRatingService = async (foodId) => {
  try {
    const result = await FoodRating.aggregate([
      {
        $match: { foodId }  // Filter theo foodId
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },  // Tính trung bình
          totalRatings: { $sum: 1 }            // Đếm số user đã đánh giá
        }
      }
    ]);
    
    if (result.length === 0) {
      return { averageRating: 0, totalRatings: 0 };
    }
    
    return {
      averageRating: Math.round(result[0].averageRating * 10) / 10,  // Làm tròn 1 chữ số
      totalRatings: result[0].totalRatings
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
