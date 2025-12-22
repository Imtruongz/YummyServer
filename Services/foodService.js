import { Food } from "../Models/foods.js";
import { User } from "../Models/users.js";
import { FoodRating } from "../Models/foodRatings.js";
import { Category } from "../Models/categories.js";
import { UserFollow } from "../Models/userFollows.js";
import { getCommentCountService } from "./reviewService.js";

// export const getAllFoodService = async () => {
//   try {
//     const foods = await Food.find();
//     return foods;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

export const getAllFoodService = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    
    // Lấy tổng số lượng food
    const total = await Food.countDocuments();
    
    // Lấy food với pagination, sắp xếp theo ngày tạo (mới nhất trước)
    const foods = await Food.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const fullFoods = await Promise.all(
      foods.map(async (food) => {
        const user = await User.findOne({ userId: food.userId }).select(
          "username avatar"
        );
        
        // Tính trung bình rating
        const ratingStats = await FoodRating.aggregate([
          { $match: { foodId: food.foodId } },
          {
            $group: {
              _id: null,
              averageRating: { $avg: "$rating" },
              totalRatings: { $sum: 1 },
            },
          },
        ]);

        const averageRating = ratingStats.length > 0
          ? Math.round(ratingStats[0].averageRating * 10) / 10
          : 0;
        const totalRatings = ratingStats.length > 0 ? ratingStats[0].totalRatings : 0;

        return { 
          ...food.toObject(), 
          userDetail: user ? user.toObject() : {},
          averageRating,
          totalRatings,
        };
      })
    );
    
    return {
      data: fullFoods,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
      }
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const searchFoodService = async (query = '', page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    
    // Tạo regex để search
    const searchRegex = new RegExp(query, 'i');
    
    // Tìm foods khớp với query (chỉ foodName)
    const total = await Food.countDocuments({
      foodName: searchRegex
    });
    
    const foods = await Food.find({
      foodName: searchRegex
    })
      .skip(skip)
      .limit(limit);
    
    const fullFoods = await Promise.all(
      foods.map(async (food) => {
        const user = await User.findOne({ userId: food.userId }).select(
          "username avatar"
        );
        
        // Tính trung bình rating
        const ratingStats = await FoodRating.aggregate([
          { $match: { foodId: food.foodId } },
          {
            $group: {
              _id: null,
              averageRating: { $avg: "$rating" },
              totalRatings: { $sum: 1 },
            },
          },
        ]);

        const averageRating = ratingStats.length > 0
          ? Math.round(ratingStats[0].averageRating * 10) / 10
          : 0;
        const totalRatings = ratingStats.length > 0 ? ratingStats[0].totalRatings : 0;

        return { 
          ...food.toObject(), 
          userDetail: user ? user.toObject() : {},
          averageRating,
          totalRatings,
        };
      })
    );
    
    return {
      data: fullFoods,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
      }
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getDetailFoodService = async (foodId) => {
  try {
    // Truy vấn thông tin món ăn
    const food = await Food.findOne({ foodId: foodId });
    if (!food) throw new Error("Food not found");

    // Truy vấn thông tin người dùng dựa trên userId
    const user = await User.findOne({ userId: food.userId }).select(
      "username email avatar"
    );

    if (!user) throw new Error("User not found");

    // Truy vấn thông tin loại danh mục dựa trên categoryId
    const category = await Category.findOne({ categoryId: food.categoryId }).select(
      "categoryId categoryName"
    );

    // Tính trung bình rating của food
    const ratingStats = await FoodRating.aggregate([
      { $match: { foodId: foodId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    const averageRating = ratingStats.length > 0
      ? Math.round(ratingStats[0].averageRating * 10) / 10
      : 0;
    const totalRatings = ratingStats.length > 0 ? ratingStats[0].totalRatings : 0;

    // Kết hợp thông tin món ăn, user, category và rating trước khi trả về
    return {
      ...food.toObject(),
      userDetail: user.toObject(),
      categoryDetail: category ? category.toObject() : null,
      averageRating,
      totalRatings,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};


export const getFoodByCategoryService = async (categoryId) => {
  try {
    const foods = await Food.find({ categoryId: categoryId });
    const fullFoods = await Promise.all(
      foods.map(async (food) => {
        const user = await User.findOne({ userId: food.userId }).select(
          "username avatar"
        );
        
        // Tính trung bình rating
        const ratingStats = await FoodRating.aggregate([
          { $match: { foodId: food.foodId } },
          {
            $group: {
              _id: null,
              averageRating: { $avg: "$rating" },
              totalRatings: { $sum: 1 },
            },
          },
        ]);

        const averageRating = ratingStats.length > 0
          ? Math.round(ratingStats[0].averageRating * 10) / 10
          : 0;
        const totalRatings = ratingStats.length > 0 ? ratingStats[0].totalRatings : 0;

        return {
          ...food.toObject(),
          userDetail: user ? user.toObject() : {},
          averageRating,
          totalRatings,
        };
      })
    );
    return fullFoods;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getFoodByUserIdService = async (userId) => {
  try {
    const foods = await Food.find({ userId: userId });
    const fullFoods = await Promise.all(
      foods.map(async (food) => {
        const user = await User.findOne({ userId: food.userId }).select(
          "username avatar"
        );
        
        // Tính trung bình rating
        const ratingStats = await FoodRating.aggregate([
          { $match: { foodId: food.foodId } },
          {
            $group: {
              _id: null,
              averageRating: { $avg: "$rating" },
              totalRatings: { $sum: 1 },
            },
          },
        ]);

        const averageRating = ratingStats.length > 0
          ? Math.round(ratingStats[0].averageRating * 10) / 10
          : 0;
        const totalRatings = ratingStats.length > 0 ? ratingStats[0].totalRatings : 0;

        return {
          ...food.toObject(),
          userDetail: user ? user.toObject() : {},
          averageRating,
          totalRatings,
        };
      })
    );
    return fullFoods;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const addFoodService = async (food) => {
  try {
    const newFood = await Food.create(food);
    return newFood;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteFoodService = async (foodId) => {
  try {
    const deletedFood = await Food.findOneAndDelete({ foodId: foodId });
    return deletedFood;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateFoodService = async (foodId, userId, fooData) => {
  try {
    // Check if food exists
    const food = await Food.findOne({ foodId: foodId });
    if (!food) {
      throw new Error("Food not found");
    }
    
    // Check ownership - only food owner can edit
    if (food.userId !== userId) {
      throw new Error("You can only edit your own food");
    }

    const foodData = {
      ...fooData,
      updatedAt: new Date(),
    };

    const updateFood = await Food.findOneAndUpdate(
      { foodId: foodId },
      foodData,
      { new: true }
    );
    return updateFood;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getFollowingFoodsService = async (userId, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    
    // Lấy danh sách những người mà user này follow
    const following = await UserFollow.find({ followerId: userId }).select('followingId');
    const followingIds = following.map(f => f.followingId);
    
    // Nếu không follow ai, trả về empty
    if (followingIds.length === 0) {
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0,
        },
      };
    }
    
    // Lấy tổng số foods từ những người follow
    const total = await Food.countDocuments({ userId: { $in: followingIds } });
    
    // Lấy foods từ những người follow, sắp xếp theo mới nhất
    const foods = await Food.find({ userId: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const fullFoods = await Promise.all(
      foods.map(async (food) => {
        const user = await User.findOne({ userId: food.userId }).select(
          "username avatar"
        );
        
        // Tính trung bình rating
        const ratingStats = await FoodRating.aggregate([
          { $match: { foodId: food.foodId } },
          {
            $group: {
              _id: null,
              averageRating: { $avg: "$rating" },
              totalRatings: { $sum: 1 },
            },
          },
        ]);

        const averageRating = ratingStats.length > 0
          ? Math.round(ratingStats[0].averageRating * 10) / 10
          : 0;
        const totalRatings = ratingStats.length > 0 ? ratingStats[0].totalRatings : 0;

        // Đếm số lượng comment
        const commentCount = await getCommentCountService(food.foodId);

        return { 
          foodId: food.foodId,
          foodName: food.foodName,
          foodDescription: food.foodDescription,
          foodThumbnail: food.foodThumbnail,
          foodIngredients: food.foodIngredients,
          foodInstructions: food.foodInstructions,
          categoryId: food.categoryId,
          userId: food.userId,
          username: user?.username || 'Unknown',
          avatar: user?.avatar || '',
          createdAt: food.createdAt,
          cookingTime: food.CookingTime || '',
          difficultyLevel: food.difficultyLevel || '',
          servings: food.servings || 0,
          averageRating,
          totalRatings,
          commentCount,
        };
      })
    );
    
    return {
      data: fullFoods,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
