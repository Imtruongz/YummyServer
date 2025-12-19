import express from 'express';
import { createNotification, getNotificationsByUser } from '../Controllers/notificationController.js';

const NotificationRouter = express.Router();


// Tạo mới thông báo (lưu vào DB)
NotificationRouter.post('/', createNotification);

// Lấy danh sách thông báo của user
NotificationRouter.get('/:userId', getNotificationsByUser);

export default NotificationRouter;
