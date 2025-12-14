import { Food } from "../Models/foods.js";
import { User } from "../Models/users.js";
import { FoodRating } from "../Models/foodRatings.js";
import { Category } from "../Models/categories.js";

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
    
    // Lấy food với pagination
    const foods = await Food.find()
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
    
    // Tìm foods khớp với query (foodName hoặc description)
    const total = await Food.countDocuments({
      $or: [
        { foodName: searchRegex },
        { foodDescription: searchRegex }
      ]
    });
    
    const foods = await Food.find({
      $or: [
        { foodName: searchRegex },
        { foodDescription: searchRegex }
      ]
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

export const updateFoodService = async (foodId, fooData) => {
  const foodData = {
    ...fooData,
    updatedAt: new Date(),
  };
  try {
    const updateFood = await Food.findOneAndUpdate(
      { foodId: foodId },
      foodData,
      { new: true }
    );
    if (!updateFood) {
      throw new Error("Food not found");
    }
    return updateFood;
  } catch (error) {
    throw new Error(error.message);
  }
};
