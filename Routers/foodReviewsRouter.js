import express from 'express';
import { addCommentToFood, getAllCommentFromFoodId, deleteComment } from '../Controllers/reviewController.js';
import { authenticateToken } from '../Config/jwtConfig.js';

const foodReviewsRouter = express.Router();

//API add comment to foodId
foodReviewsRouter.post('/addComment',authenticateToken,  addCommentToFood);
//API get all comment from foodId
foodReviewsRouter.get('/getComment/:foodId',authenticateToken,  getAllCommentFromFoodId);
//API delete your comment from foodId
foodReviewsRouter.delete('/deleteComment/:reviewId',authenticateToken,  deleteComment);
//API get all like from foodId
foodReviewsRouter.get('/like')
//API get all share from foodId
foodReviewsRouter.get('/share')
//API get all rating from foodId
foodReviewsRouter.get('/rating')

export default foodReviewsRouter;