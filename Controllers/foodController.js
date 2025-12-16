import {
  getAllFoodService,
  getDetailFoodService,
  getFoodByCategoryService,
  addFoodService,
  deleteFoodService,
  updateFoodService,
  getFoodByUserIdService,
  searchFoodService
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
    const { foodName, categoryId, userId, foodDescription, foodIngredients, foodThumbnail, foodSteps, CookingTime } = req.body;

    if (!foodName || !categoryId || !userId || !Array.isArray(foodIngredients) || !Array.isArray(foodSteps)) {
      return res.status(400).json({ message: 'Invalid or missing required fields.' });
    }

    const newFoodData = {
      foodName,
      categoryId,
      userId,
      foodDescription,
      foodIngredients,
      foodThumbnail: foodThumbnail || '',
      foodSteps,
      CookingTime
    };

    const newFood = await addFoodService(newFoodData);

    res.status(201).json({
      message: 'Food added successfully.',
      data: newFood,
    });
  } catch (error) {
    // Trả về lỗi nếu có exception
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
