import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { User } from '../Models/users.js';


dotenv.config({
   path: "./.env",
});

// Tạo access token (ngắn hạn)
export const generateAccessToken = (user, expiresIn = '1h') => {
   return jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn });
};

// Tạo refresh token (dài hạn)
export const generateRefreshToken = (user, expiresIn = '7d') => {
   return jwt.sign({ userId: user.userId }, process.env.JWT_REFRESH_SECRET, { expiresIn });
};

// Xác thực token
export const verifyToken = (token) => {
   try {
      return jwt.verify(token, process.env.JWT_SECRET);
   } catch (err) {
      throw new Error('Token không hợp lệ');
   }
};

// Handler: cấp access token mới từ refresh token (nhận qua header/body, không dùng cookie)
export const refreshAccessTokenHandler = async (req, res) => {
   try {
      // Ưu tiên header Authorization: Bearer <refreshToken>
      const authHeader = req.header('Authorization');
      let refreshToken = authHeader?.startsWith('Bearer ')
         ? authHeader.split(' ')[1]
         : undefined;
      if (!refreshToken) {
         // Fallback: từ body
         refreshToken = req.body?.refreshToken;
      }
      if (!refreshToken) {
         return res.status(401).json({ message: 'Thiếu refresh token' });
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findOne({ userId: decoded.userId });
      if (!user) {
         return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      const newAccessToken = generateAccessToken(user, '1h');
      return res.json({ accessToken: newAccessToken });
   } catch (error) {
      return res.status(403).json({ message: 'Refresh token không hợp lệ' });
   }
};

// Middleware kiểm tra access token
export const authenticateToken = async (req, res, next) => {
   const token = req.header('Authorization')?.split(' ')[1];
   if (!token) {
      return res.status(401).json({ message: 'Bạn cần đăng nhập để thực hiện thao tác này' });
   }
   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
   } catch (err) {
      return res.status(401).json({ message: 'Access token hết hạn hoặc không hợp lệ' });
   }
};
