import { Category } from "../Models/categories.js";

export const addCategoryService = async ({ categoryName, categoryThumbnail }) => {
    try {
      const existingCategory = await Category.findOne({ categoryName });
      if (existingCategory) {
        throw new Error("Danh mục đã tồn tại");
      }
  
      const newCategory = new Category({ categoryName, categoryThumbnail });
      await newCategory.save();
      return newCategory;
    } catch (error) {
      throw new Error("Lỗi khi thêm danh mục mới: " + error.message);
    }
  };
  

//Get all categories
export const getAllCategoriesService = async () => {
  try {
    const categories = await Category.find();
    return categories;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách danh mục");
  }
};
