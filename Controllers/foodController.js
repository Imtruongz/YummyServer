import {
  getAllFoodService,
  getDetailFoodService,
  getFoodByCategoryService,
  addFoodService,
  deleteFoodService,
  updateFoodService,
  getFoodByUserIdService
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
    const foods = await getAllFoodService();
    res.json(foods);
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
    foodName,
    categoryId,
    foodDescription,
    foodIngredients,
    foodThumbnail,
    foodSteps,
  } = req.body;
  try {
    const updatedFood = await updateFoodService(foodId, {
      foodName,
      categoryId,
      foodDescription,
      foodIngredients,
      foodThumbnail,
      foodSteps,
    });
    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
