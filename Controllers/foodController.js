import {
  getAllFoodService,
  getDetailFoodService,
  getFoodByCategoryService,
  addFoodService,
  deleteFoodService,
  updateFoodService,
  getFoodByUserIdService,
  searchFoodService,
  getFollowingFoodsService
} from "../Services/foodService.js";

// export const getAllFood = async (req, res) => {
//   try {
//     const foods = await getAllFoodService();
//     res.status(200).json(foods);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getAllFood = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await getAllFoodService(page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchFood = async (req, res) => {
  try {
    const query = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await searchFoodService(query, page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getDetailFood = async (req, res) => {
  const { foodId } = req.params;
  try {
    const food = await getDetailFoodService(foodId);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFoodByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const foods = await getFoodByCategoryService(categoryId);
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFoodByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const foods = await getFoodByUserIdService(userId);
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const addFood = async (req, res) => {
  try {
    // ⭐ Lấy userId từ JWT token (source of truth)
    const authenticatedUserId = req.user?.userId;
    const { foodName, categoryId, foodDescription, foodIngredients, foodThumbnail, foodSteps, CookingTime, difficultyLevel, servings } = req.body;

    // ⭐ Validate required fields (không check userId từ body, dùng token)
    if (!foodName || !categoryId || !Array.isArray(foodIngredients) || !Array.isArray(foodSteps)) {
      return res.status(400).json({ message: 'Invalid or missing required fields.' });
    }

    if (!authenticatedUserId) {
      console.log("🚫 [AUTH] No user ID in token");
      return res.status(401).json({ message: 'Unauthorized: Invalid token. Please login again.' });
    }

    const newFoodData = {
      foodName,
      categoryId,
      userId: authenticatedUserId, // ⭐ Always use authenticated user ID from token
      foodDescription,
      foodIngredients,
      foodThumbnail: foodThumbnail || '',
      foodSteps,
      CookingTime,
      difficultyLevel,
      servings
    };

    console.log("✅ [FOOD] Adding food for user:", authenticatedUserId);
    const newFood = await addFoodService(newFoodData);

    res.status(201).json({
      message: 'Food added successfully.',
      data: newFood,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const deletedFood = await deleteFoodService(foodId);
    res.status(200).json(deletedFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFood = async (req, res) => {
  const {
    foodId,
    userId,
    foodName,
    categoryId,
    foodDescription,
    foodIngredients,
    foodThumbnail,
    foodSteps,
    CookingTime,
  } = req.body;
  try {
    if (!foodId || !userId) {
      return res.status(400).json({ message: 'foodId and userId are required.' });
    }

    const updatedFood = await updateFoodService(foodId, userId, {
      foodName,
      categoryId,
      foodDescription,
      foodIngredients,
      foodThumbnail,
      foodSteps,
      CookingTime,
    });
    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(error.message.includes('only edit') ? 403 : 500).json({ message: error.message });
  }
};

export const getFollowingFoods = async (req, res) => {
  try {
    const { userId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    
    const result = await getFollowingFoodsService(userId, page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
