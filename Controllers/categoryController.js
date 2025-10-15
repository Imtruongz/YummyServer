import { addCategoryService, getAllCategoriesService } from "../Services/categoryService.js";

export const addCategory = async (req, res) => {
  const { categoryName, categoryThumbnail } = req.body;

  if (!categoryName || !categoryThumbnail) {
    return res
      .status(400)
      .json({ message: "Tên danh mục và hình ảnh là bắt buộc" });
  }

  try {
    const newCategory = await addCategoryService({
      categoryName,
      categoryThumbnail,
    });
    res
      .status(201)
      .json({ message: "Thêm danh mục thành công", category: newCategory });
  } catch (err) {
    console.log("Lỗi khi thêm danh mục:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await getAllCategoriesService();
    res.status(200).json(categories);
  } catch (err) {
    console.log("Lỗi khi lấy danh sách danh mục:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};


