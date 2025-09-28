import { GoogleAuth } from 'google-auth-library';
import axios from 'axios';
import fs from 'fs';

// Đường dẫn tới file service account JSON
const serviceAccountPath = process.env.FCM_SERVICE_ACCOUNT_PATH || './service-account.json';
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
const projectId = serviceAccount.project_id;

// Hàm lấy access token
async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: serviceAccountPath,
    scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
  });
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  return accessToken.token;
}

/**
 * Gửi push notification qua FCM HTTP v1
 * @param {string} fcmToken - Token FCM của người nhận
 * @param {string} title - Tiêu đề thông báo
 * @param {string} body - Nội dung thông báo
 * @param {object} [data] - (Optional) Data message
 */
export const sendPushNotification = async (fcmToken, title, body, data = {}) => {
  const accessToken = await getAccessToken();
  const url = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;

  const payload = {
    message: {
      token: fcmToken,
      notification: {
        title,
        body,
      },
      data,
    },
  };

  await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
};
