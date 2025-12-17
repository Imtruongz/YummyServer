
import express from 'express';
import {registerUser, loginUser, updateUser, deleteUser, getAllUser, getUserById, getUserByEmail, changePassword, loginWithFacebook, updateFcmToken, verifyEmail, resendVerificationEmail} from '../Controllers/userController.js'
import { authenticateToken } from '../Config/jwtConfig.js';

const UserRouter = express.Router();

// API cập nhật FCM token cho user
UserRouter.patch('/update-fcm-token', authenticateToken, updateFcmToken)

// ← NEW: Email verification routes
UserRouter.post('/verify-email', verifyEmail)
UserRouter.post('/resend-verification-email', resendVerificationEmail)

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