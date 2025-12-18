
import express from 'express';
import {registerUser, loginUser, updateUser, deleteUser, getAllUser, getUserById, getUserByEmail, changePassword, loginWithFacebook, updateFcmToken, verifyEmail, resendVerificationEmail, forgotPassword, verifyResetCode} from '../Controllers/userController.js'
import { authenticateToken } from '../Config/jwtConfig.js';

const UserRouter = express.Router();

// API cập nhật FCM token cho user
UserRouter.patch('/update-fcm-token', authenticateToken, updateFcmToken)

// ← Email verification routes (signup)
UserRouter.post('/verify-email', verifyEmail)
UserRouter.post('/resend-verification-email', resendVerificationEmail)

// ← Forgot password routes (password reset flow)
UserRouter.post('/forgot-password', forgotPassword)
UserRouter.post('/verify-reset-code', verifyResetCode)

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