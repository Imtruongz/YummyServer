import express from 'express';

import { addFood, getAllFood, getDetailFood, getFoodByCategory, deleteFood, updateFood, getFoodByUserId, searchFood, getFollowingFoods } from '../Controllers/foodController.js';
import { authenticateToken } from '../Config/jwtConfig.js';

const foodsRoute = express.Router();

foodsRoute.get('/getAll',authenticateToken,   getAllFood)
foodsRoute.get('/search',authenticateToken,  searchFood)//Search foods
foodsRoute.get('/following',authenticateToken,  getFollowingFoods)//Get foods from following users
foodsRoute.get('/getDetail/:foodId',authenticateToken,  getDetailFood)
foodsRoute.get('/getFoodsByCategory/:categoryId',authenticateToken,  getFoodByCategory)
foodsRoute.get('/getFoodByUserId/:userId',authenticateToken,  getFoodByUserId)
foodsRoute.post('/add',authenticateToken,  addFood)
foodsRoute.delete('/delete/:foodId',authenticateToken,  deleteFood)
foodsRoute.put('/update',authenticateToken,  updateFood)

export default foodsRoute;