import { FoodReview } from "../Models/foodReviews.js";
import { User } from "../Models/users.js";

export const addCommentToFoodService = async ({
  foodId,
  userId,
  reviewText,
}) => {
  try {
    const newComment = new FoodReview({
      foodId,
      userId,
      reviewText,
    });

    // Lưu bình luận vào cơ sở dữ liệu
    await newComment.save();
    return newComment;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Lấy thông tin bình luận dựa vào ID
export const getCommentService = async (reviewId) => {
  try {
    const comment = await FoodReview.findOne({ reviewId }); // Tìm bình luận theo reviewId
    return comment;
  } catch (error) {
    throw new Error(error.message);
  }
};


//delete comment from foodId
export const deleteCommentService = async (reviewId) => {
  try {
    const comments = await FoodReview.findOneAndDelete({ reviewId });
    return comments;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllCommentsFromFoodIdService = async (foodId) => {
  try {
    // Lấy tất cả các comment liên quan đến foodId
    const comments = await FoodReview.find({ foodId }); // Không dùng .lean(), giống với getAllFoodService

    // Map qua từng comment và tìm chi tiết người dùng
    const fullComments = await Promise.all(
      comments.map(async (comment) => {
        const user = await User.findOne({ userId: comment.userId }).select(
          "username avatar"
        ); // Tìm user dựa trên userId từ comment

        // Chèn thêm thông tin userDetail vào mỗi comment
        return {
          ...comment.toObject(), // Chuyển comment sang object để có thể chèn thêm property
          userDetail: user ? user.toObject() : {}, // Nếu không tìm thấy user, trả về object rỗng
        };
      })
    );
    return fullComments;
  } catch (error) {
    throw new Error(error.message);
  }
};
