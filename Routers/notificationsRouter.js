import express from 'express';
import { sendPushNotification } from '../utils/sendPushNotification.js';

const NotificationRouter = express.Router();

NotificationRouter.post('/push', async (req, res) => {
  const { fcmToken, title, body } = req.body;
  if (!fcmToken || !title || !body) {
    return res.status(400).json({ message: 'Missing fcmToken, title, or body' });
  }
  try {
    await sendPushNotification(fcmToken, title, body);
    res.status(200).json({ message: 'Push notification sent!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send push notification', error: err.message });
  }
});

export default NotificationRouter;
