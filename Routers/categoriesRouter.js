import express from "express";

import { addCategory, getAllCategories } from "../Controllers/categoryController.js";
import { authenticateToken } from "../Config/jwtConfig.js";

const categoriesRouter = express.Router();


//Done
categoriesRouter.get("/getAll", authenticateToken,  getAllCategories);
categoriesRouter.post("/add", authenticateToken,  addCategory);

export default categoriesRouter;
