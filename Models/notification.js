import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Người nhận thông báo
  actorId: { type: String, required: true }, // Người thực hiện hành động (comment, follow...)
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String, default: 'system' }, // Loại thông báo: comment, follow, system...
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Notification = mongoose.model('Notification', notificationSchema);
