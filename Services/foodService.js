import { Food } from "../Models/foods.js";
import { User } from "../Models/users.js";

// export const getAllFoodService = async () => {
//   try {
//     const foods = await Food.find();
//     return foods;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

export const getAllFoodService = async () => {
  try {
    const foods = await Food.find(); // Lấy tất cả món ăn
    const fullFoods = await Promise.all(
      foods.map(async (food) => {
        const user = await User.findOne({ userId: food.userId }).select(
          "username avatar"
        );
        return { 
          ...food.toObject(), 
          userDetail: user ? user.toObject() : {}
        };
      })
    );
    return fullFoods;
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

    // Kết hợp thông tin món ăn và user trước khi trả về
    return {
      ...food.toObject(),
      userDetail: user.toObject(),
    };
  } catch (error) {
    throw new Error(error.message);
  }
};


export const getFoodByCategoryService = async (categoryId) => {
  try {
    const foods = await Food.find({ categoryId: categoryId });
    return foods; // return
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getFoodByUserIdService = async (userId) => {
  try {
    const foods = await Food.find({ userId: userId });
    return foods;
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
