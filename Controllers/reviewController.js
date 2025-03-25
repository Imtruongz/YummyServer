import {
  addCommentToFoodService,
  getAllCommentsFromFoodIdService,
  deleteCommentService,
  getCommentService,
} from "../Services/reviewService.js";

export const addCommentToFood = async (req, res) => {
  const { foodId, userId, reviewText } = req.body;

  try {
    // Kiểm tra các trường bắt buộc
    if (!userId || !reviewText) {
      return res
        .status(400)
        .json({ message: "User ID and review text are required." });
    }

    // Gọi service để thêm bình luận
    const newComment = await addCommentToFoodService({
      foodId,
      userId,
      reviewText,
    });

    res.status(201).json({
      message: "Comment added successfully.",
      data: newComment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa bình luận chỉ khi userId khớp
export const deleteComment = async (req, res) => {
  const { reviewId } = req.params; // Lấy reviewId từ URL
  const userId = req.user.userId; // Lấy userId của người dùng hiện tại từ mã Token
  try {
    const comment = await getCommentService(reviewId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }
    if (comment.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment." });
    }
    const deletedComment = await deleteCommentService(reviewId);
    res.status(200).json({
      message: "Comment deleted successfully.",
      data: deletedComment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCommentFromFoodId = async (req, res) => {
  const { foodId } = req.params;

  try {
    const comments = await getAllCommentsFromFoodIdService(foodId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
