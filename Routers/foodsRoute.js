import express from 'express';

import { addFood, getAllFood, getDetailFood, getFoodByCategory, deleteFood, updateFood, getFoodByUserId, searchFood } from '../Controllers/foodController.js';
import { authenticateToken } from '../Config/jwtConfig.js';

const foodsRoute = express.Router();

foodsRoute.get('/getAll',authenticateToken,   getAllFood)//DOne
foodsRoute.get('/search',authenticateToken,  searchFood)//Search foods
foodsRoute.get('/getDetail/:foodId',authenticateToken,  getDetailFood)//DOne
foodsRoute.get('/getFoodsByCategory/:categoryId',authenticateToken,  getFoodByCategory)
foodsRoute.get('/getFoodByUserId/:userId',authenticateToken,  getFoodByUserId)
foodsRoute.post('/add',authenticateToken,  addFood)//Done
foodsRoute.delete('/delete/:foodId',authenticateToken,  deleteFood)//Done
foodsRoute.put('/update',authenticateToken,  updateFood)//Done

export default foodsRoute;