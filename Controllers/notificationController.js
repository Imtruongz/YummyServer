import { Notification } from '../Models/notification.js';

// Tạo mới thông báo (lưu vào DB và trả về)
export const createNotification = async (req, res) => {
  try {
    const { userId, title, body, type } = req.body;
    const notification = await Notification.create({ userId, title, body, type });
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create notification', error: err.message });
  }
};

// Lấy danh sách thông báo của user
export const getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get notifications', error: err.message });
  }
};
