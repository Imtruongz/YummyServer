import { GoogleAuth } from 'google-auth-library';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load service account from environment variable or file
let serviceAccount;
let projectId;

const initServiceAccount = () => {
  try {
    // First, try to get from FCM_SERVICE_ACCOUNT environment variable (for production)
    if (process.env.FCM_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FCM_SERVICE_ACCOUNT);
      projectId = serviceAccount.project_id;
      console.log('✓ Service account loaded from FCM_SERVICE_ACCOUNT env var');
      return true;
    }
    
    // Fallback to file (for local development)
    const serviceAccountPath = process.env.FCM_SERVICE_ACCOUNT_PATH || path.join(__dirname, '../service-account.json');
    if (fs.existsSync(serviceAccountPath)) {
      serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      projectId = serviceAccount.project_id;
      console.log('✓ Service account loaded from file:', serviceAccountPath);
      return true;
    }
    
    console.warn('⚠ Warning: FCM service account not found. Push notifications will be disabled.');
    return false;
  } catch (error) {
    console.error('Error initializing service account:', error.message);
    return false;
  }
};

// Initialize on module load
const isInitialized = initServiceAccount();

// Hàm lấy access token
async function getAccessToken() {
  if (!isInitialized || !serviceAccount) {
    throw new Error('FCM service account not initialized. Please set FCM_SERVICE_ACCOUNT environment variable or provide service-account.json file.');
  }

  const auth = new GoogleAuth({
    credentials: serviceAccount,
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
  if (!isInitialized || !serviceAccount) {
    console.warn('⚠ FCM not configured. Skipping push notification.');
    return { success: false, message: 'FCM not initialized' };
  }

  try {
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
    
    return { success: true };
  } catch (error) {
    console.error('Error sending push notification:', error.message);
    throw error;
  }
};
