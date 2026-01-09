
import express from 'express';
import { registerUser, loginUser, updateUser, deleteUser, getAllUser, getPopularCreators, getUserById, getUserByEmail, changePassword, loginWithFacebook, verifyEmail, resendVerificationEmail, forgotPassword, verifyResetCode } from '../Controllers/userController.js'
import { authenticateToken, refreshAccessTokenHandler } from '../Config/jwtConfig.js';

const UserRouter = express.Router();

// ← Email verification routes (signup)
UserRouter.post('/verify-email', verifyEmail)
UserRouter.post('/resend-verification-email', resendVerificationEmail)

// ← Forgot password routes (password reset flow)
UserRouter.post('/forgot-password', forgotPassword)
UserRouter.post('/verify-reset-code', verifyResetCode)


UserRouter.get('/getAll', authenticateToken, getAllUser)
UserRouter.get('/popular-creators', authenticateToken, getPopularCreators)
UserRouter.get('/getUserById/:userId', authenticateToken, getUserById)
UserRouter.get('/getUserByEmail', authenticateToken, getUserByEmail)

UserRouter.post('/login', loginUser)
UserRouter.post("/register", registerUser)
UserRouter.post("/facebook-login", loginWithFacebook)
// Refresh access token using refresh token
UserRouter.post('/refresh', refreshAccessTokenHandler)

UserRouter.patch('/update', authenticateToken, updateUser)
UserRouter.patch('/changePassword', authenticateToken, changePassword)

UserRouter.delete('/delete', authenticateToken, deleteUser)

export default UserRouter;