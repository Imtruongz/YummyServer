import express from 'express';
import {registerUser, loginUser, updateUser, deleteUser, getAllUser, getUserById, getUserByEmail, changePassword, loginWithFacebook} from '../Controllers/userController.js'
import { authenticateToken } from '../Config/jwtConfig.js';

const UserRouter = express.Router();


//Done
UserRouter.get('/getAll',authenticateToken,  getAllUser)
UserRouter.get('/getUserById/:userId',authenticateToken,  getUserById)
UserRouter.get('/getUserByEmail',authenticateToken,  getUserByEmail)

UserRouter.post('/login', loginUser)
UserRouter.post("/register", registerUser)
UserRouter.post("/facebook-login", loginWithFacebook)

UserRouter.patch('/update',authenticateToken, updateUser)
UserRouter.patch('/changePassword',authenticateToken,  changePassword)

UserRouter.delete('/delete',authenticateToken,  deleteUser)

export default UserRouter;