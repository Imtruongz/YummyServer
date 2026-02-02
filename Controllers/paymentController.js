// Controllers/paymentController.js
// Controller xử lý các request liên quan đến thanh toán

// Database giả lập để lưu trữ các phiên thanh toán
const paymentSessions = {
  // Token cố định để test không cần tạo mới
  "test123": {
    amount: 50000,
    description: "Thanh toán từ ứng dụng YummyApp - TOKEN TEST",
    merchantName: "YummyFood Test",
    merchantId: "YUMMY001",
    currency: "LAK",
    orderId: "ORDER_TEST_123",
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 phút
    status: "pending"
  }
};

// Token expiration time (15 minutes in milliseconds)
const TOKEN_EXPIRATION_TIME = 15 * 60 * 1000;

/**
 * Kiểm tra token có hết hạn không
 */
const isTokenExpired = (token) => {
  const session = paymentSessions[token];
  if (!session) return true;
  return new Date() > session.expiresAt;
};

/**
 * Tạo một phiên thanh toán mới và trả về token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createPaymentSession = async (req, res) => {
  try {
    // Lấy userId từ JWT token nếu có (người gửi)
    const userId = req.user ? req.user.userId : null;

    // Lấy thông tin từ request body
    const { amount = 10000, description = "Thanh toán từ YummyApp", merchantName = "YummyFood", receiverId } = req.body;

    // Tạo token duy nhất bằng timestamp và số ngẫu nhiên
    const token = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

    // Thông tin tài khoản ngân hàng mặc định nếu không tìm thấy tài khoản người nhận
    let bankInfo = {
      bankName: "Military Commercial Joint Stock Bank - Laos branch",
      accountNumber: "100000427769",
      bankCode: "MB",
      accountName: "HOANG NAM TIEN"
    };

    try {
      // Import service để lấy thông tin tài khoản ngân hàng
      const bankAccountService = await import('../Services/bankAccountService.js');

      // Nếu có receiverId, ưu tiên lấy tài khoản của người nhận donate
      if (receiverId) {
        const receiverBankAccount = await bankAccountService.getBankAccount(receiverId);

        if (receiverBankAccount) {
          console.log(`Đã tìm thấy tài khoản ngân hàng của người nhận: ${receiverId}`);
          bankInfo = {
            bankName: receiverBankAccount.bankName,
            accountNumber: receiverBankAccount.accountNumber,
            bankCode: receiverBankAccount.bankCode,
            accountName: receiverBankAccount.accountName
          };
        } else {
          console.log(`Không tìm thấy tài khoản ngân hàng của người nhận: ${receiverId}, sử dụng thông tin mặc định`);
        }
      }
    } catch (error) {
      console.log("Lỗi khi lấy thông tin tài khoản ngân hàng:", error);
      // Tiếp tục sử dụng thông tin mặc định nếu có lỗi
    }

    // Lưu thông tin vào database giả lập với dữ liệu từ bankInfo
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_TIME);
    paymentSessions[token] = {
      // ✨ Metadata
      token,
      senderId: userId,
      receiverId,
      merchantName,
      merchantId: "YUMMY001",
      orderId: `YM-${Date.now()}`,

      // ✨ Thông tin thanh toán
      amount,
      transactionAmount: amount,
      description,
      currency: "LAK",

      // ✨ Thông tin tài khoản
      bankName: bankInfo.bankName,
      accountNumber: bankInfo.accountNumber,
      bankCode: bankInfo.bankCode,
      accountName: bankInfo.accountName,

      // ✨ Trạng thái & thời gian
      status: "pending",
      createdAt: new Date(),
      expiresAt: expiresAt,

      // ✨ Data cho MBLaos
      dataBank: {
        beneficiaryCustomerName: bankInfo.accountName,
        customerAccNumber: "100000123042",
        beneficiaryAccountNumber: bankInfo.accountNumber,
        beneficiaryBankCode: bankInfo.bankCode,
        beneficiaryBankName: bankInfo.bankName,
        status: 1,
        type: "INTERNAL_BANK"
      }
    };

    console.log(`✅ Tạo phiên thanh toán thành công - Token: ${token}`);

    return res.status(200).json({
      success: true,
      token,
      message: "Tạo phiên thanh toán thành công"
    });
  } catch (error) {
    console.log("Lỗi tạo phiên thanh toán:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server, không thể tạo phiên thanh toán"
    });
  }
};

/**
 * ✨ Lấy thông tin phiên thanh toán từ token (MBLaos sẽ gọi endpoint này)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPaymentSession = (req, res) => {
  try {
    const { token } = req.query;

    console.log(`📝 GET /api/payment/get-session với token: ${token}`);
    console.log(`🔑 Danh sách token hiện có: ${Object.keys(paymentSessions).join(', ')}`);

    // Kiểm tra token có được cung cấp không
    if (!token) {
      console.log('❌ Yêu cầu thiếu token');
      return res.status(400).json({
        success: false,
        message: "Thiếu token thanh toán"
      });
    }

    // Kiểm tra token có tồn tại không
    const paymentInfo = paymentSessions[token];

    if (!paymentInfo) {
      console.log(`❌ Không tìm thấy thông tin cho token: ${token}`);
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin thanh toán với token này"
      });
    }

    // Kiểm tra token có hết hạn không
    if (isTokenExpired(token)) {
      console.log(`❌ Token đã hết hạn: ${token}`);
      return res.status(400).json({
        success: false,
        message: "Token thanh toán đã hết hạn"
      });
    }

    console.log(`✅ Tìm thấy thông tin thanh toán cho token: ${token}`);

    // Trả về thông tin phiên thanh toán cho MBLaos
    return res.status(200).json({
      success: true,
      data: {
        token,
        amount: paymentInfo.amount,
        description: paymentInfo.description,
        merchantName: paymentInfo.merchantName,
        merchantId: paymentInfo.merchantId,
        orderId: paymentInfo.orderId,
        currency: paymentInfo.currency,

        // ✨ Thông tin tài khoản nhận tiền
        bankName: paymentInfo.bankName,
        accountNumber: paymentInfo.accountNumber,
        accountName: paymentInfo.accountName,
        bankCode: paymentInfo.bankCode,

        // ✨ Timestamp
        createdAt: paymentInfo.createdAt,
        expiresAt: paymentInfo.expiresAt
      }
    });

  } catch (error) {
    console.log("Lỗi lấy thông tin phiên thanh toán:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server, không thể lấy thông tin phiên thanh toán"
    });
  }
};

/**
 * ✨ Keep getOrderInfo để backward compatibility
 */
export const getOrderInfo = getPaymentSession;

/**
 * ✨ Nhận callback từ MBLaos sau khi xử lý thanh toán
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const paymentCallback = (req, res) => {
  try {
    const { token, status, transactionId, errorMessage } = req.body;

    console.log(`📥 Nhận callback từ MBLaos - Token: ${token}, Status: ${status}`);

    // Kiểm tra token có được cung cấp không
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Thiếu token thanh toán"
      });
    }

    // Kiểm tra token có tồn tại không
    if (!paymentSessions[token]) {
      console.log(`❌ Không tìm thấy phiên thanh toán cho token: ${token}`);
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phiên thanh toán với token này"
      });
    }

    // Cập nhật trạng thái
    const session = paymentSessions[token];
    session.status = status; // 'success', 'failed', 'cancelled', 'pending'
    session.transactionId = transactionId;
    session.errorMessage = errorMessage;
    session.completedAt = new Date();

    // ✨ Tạo callback URL để MBLaos mở lại Yummy app
    const callbackUrl = `yummy://payment-result?token=${token}&status=${status}&transactionId=${transactionId || ''}`;

    console.log(`✅ Cập nhật phiên thanh toán thành công - Status: ${status}`);
    console.log(`📱 Callback URL để mở lại Yummy: ${callbackUrl}`);

    // Có thể thêm logic gọi database, send notification, v.v ở đây

    return res.status(200).json({
      success: true,
      message: "Nhận callback thành công",
      callbackUrl: callbackUrl,
      data: {
        token,
        status,
        transactionId
      }
    });

  } catch (error) {
    console.log("Lỗi xử lý callback thanh toán:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server, không thể xử lý callback"
    });
  }
};

/**
 * ✨ Keep updatePaymentStatus để backward compatibility
 */
export const updatePaymentStatus = paymentCallback;

// ==========================================
// 🚀 BACKGROUND JOB & POLLING LOGIC
// ==========================================

import axios from 'axios';

const MBLAOS_CONFIG = {
  baseUrl: 'http://qa-mb-laos-gateway-api.evotek.vn/api/gateway/v1',
  username: 'lottery',
  password: 'ekboh8rKhEQmN5RC/WlHpRksFomWI0zfhQXcQw/yt28vjDmPV3sWZsBCBR3gf6LjkROuX4hDLM803EEty+OZXAzwIAz5XK1FR0bQm0yH7wHbP5zPUec/5GAAkgEvgX/P4z1/OYw2Ec0ng6pwpuDlwtWRyP4AMlO4L2/tVS3pVh6Hk26gtr5HiEvGVQaX7L4m8OlqBQHk6PqLZ7pre2e2Gerlu1LU3gPAyQ8Ej3JHrImn1dPTZc/+x4wGYXcN41fce3iXwKqVCShoW7peHKXtcoPAebU8DSUQNk3M6AF22+4t9gnuqwhgB9FVdgSS6OSoVArhPRFk49VV0CGUvyTy+g=='
};

// Store active MBLaos token for server use
let serverMBLaosToken = null;

/**
 * 🔐 Login to MBLaos from Server
 */
const loginMBLaosServer = async () => {
  try {
    console.log('[Server-Worker] 🔐 Logging in to MBLaos...');
    const response = await axios.post(`${MBLAOS_CONFIG.baseUrl}/authenticate/client/login`, {
      username: MBLAOS_CONFIG.username,
      password: MBLAOS_CONFIG.password
    }, {
      headers: {
        'Content-Type': 'application/json',
        'DEVICE_TOKEN': 'yummy-app-device-token',
        'CLIENT_MESSAGE_ID': `server-${Date.now()}`
      }
    });

    if (response.data && response.data.csrfToken) {
      serverMBLaosToken = response.data.csrfToken;
      console.log('[Server-Worker] ✅ Login success. Token acquired:', serverMBLaosToken.substring(0, 20) + '...');
      return serverMBLaosToken;
    }
  } catch (error) {
    console.error('[Server-Worker] ❌ Login failed:', error.message);
  }
  return null;
};

/**
 * 🔍 Verify Transaction Status with MBLaos
 */
const verifyTransactionWithMBLaos = async (transactionId) => {
  if (!serverMBLaosToken) {
    await loginMBLaosServer();
  }

  if (!serverMBLaosToken) return null;

  try {
    // console.log(`[Server-Worker] 🔍 Verifying TXN: ${transactionId}`);
    const response = await axios.post(
      `${MBLAOS_CONFIG.baseUrl}/client/inter-app/transaction/verify-status`,
      { transactionIds: [transactionId] },
      {
        headers: {
          'Authorization': `Bearer ${serverMBLaosToken}`,
          'DEVICE_TOKEN': 'yummy-app-device-token',
          'CLIENT_MESSAGE_ID': `check-${transactionId}`
        }
      }
    );

    const data = response.data;
    // Handle array response
    const transactionData = Array.isArray(data) ? data[0] : data;
    return transactionData;

  } catch (error) {
    console.error(`[Server-Worker] ❌ Verify error for ${transactionId}:`, error.message);
    // If 401 Unauthorized, reset token to force login next time
    if (error.response && error.response.status === 401) {
      serverMBLaosToken = null;
    }
    return null;
  }
};

/**
 * ✨ Register a new transaction to be monitored by the Server
 * (App calls this when user starts payment)
 */
export const registerTransaction = async (req, res) => {
  try {
    const { transactionId, amount, userId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ success: false, message: 'Missing transactionId' });
    }

    // Save to memory (simulating DB)
    // We use transactionId as the key for easier lookup
    paymentSessions[transactionId] = {
      token: transactionId, // using txnId as token for simplicity here or map it
      transactionId,
      amount,
      senderId: userId,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
      isMonitored: true // Flag to indicate this needs polling
    };

    console.log(`[Server] 📝 Registered new transaction for monitoring: ${transactionId}`);

    return res.status(200).json({ success: true, message: 'Transaction registered' });
  } catch (error) {
    console.error('[Server] Register error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

/**
 * ⏰ Cron Job: Scan for pending transactions every 1 minute
 */
const startPollingService = () => {
  console.log('[Server-Worker] 🚀 Payment Polling Service Started (Interval: 60s)');

  setInterval(async () => {
    // console.log('[Server-Worker] 🔄 Scanning pending transactions...');

    // 1. Get all pending sessions that are monitored
    const pendingTxns = Object.values(paymentSessions).filter(session =>
      session.isMonitored &&
      session.status === 'pending' &&
      new Date() < session.expiresAt // Only check if not expired
    );

    if (pendingTxns.length === 0) return;

    console.log(`[Server-Worker] Found ${pendingTxns.length} pending transactions. Checking...`);

    // 2. Check each transaction
    for (const session of pendingTxns) {
      const result = await verifyTransactionWithMBLaos(session.transactionId);

      if (result) {
        const remoteStatus = result.transactionStatus || result.status;

        if (remoteStatus === 'SUCCESS' || result.code === '00') {
          console.log(`[Server-Worker] 🎉 Transaction ${session.transactionId} SUCCEEDED! Updating DB...`);
          session.status = 'success';
          session.completedAt = new Date();
          session.externalData = result;

          // Here you would trigger Socket.io / FCM to notify the App
          // notifyClient(session.senderId, 'Payment Success');
        } else if (remoteStatus === 'FAILED' || remoteStatus === 'CANCELLED') {
          console.log(`[Server-Worker] ❌ Transaction ${session.transactionId} FAILED.`);
          session.status = 'failed';
        }
      }

      // Add small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));
    }

  }, 60000); // Run every 60 seconds
};

// Start the service immediately
startPollingService();