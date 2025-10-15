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
    status: "pending"
  }
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
    paymentSessions[token] = {
      bankName: bankInfo.bankName,
      accountNumber: bankInfo.accountNumber,
      transactionAmount: amount,
      bankCode: bankInfo.bankCode,
      save: true,
      dataBank: {
        beneficiaryCustomerName: bankInfo.accountName,
        customerAccNumber: "100000123042", // Số tài khoản người gửi (fix cứng do không có trong database)
        beneficiaryAccountNumber: bankInfo.accountNumber,
        beneficiaryBankCode: bankInfo.bankCode,
        beneficiaryBankName: bankInfo.bankName,
        status: 1,
        type: "INTERNAL_BANK"
      }
    };
    
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
 * Lấy thông tin đơn hàng từ token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getOrderInfo = (req, res) => {
  try {
    const { token } = req.query;
    
    // Log yêu cầu và danh sách token hiện có
    console.log(`📝 GET /api/payment/order-info với token: ${token}`);
    console.log(`🔑 Danh sách token hiện có: ${Object.keys(paymentSessions).join(', ')}`);
    
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
    
    console.log(`✅ Tìm thấy thông tin thanh toán cho token: ${token}`);
    console.log(paymentInfo);
    
    // Trả về thông tin đơn hàng
    return res.status(200).json({
      success: true,
      data: paymentInfo
    });
    
  } catch (error) {
    console.log("Lỗi lấy thông tin đơn hàng:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server, không thể lấy thông tin đơn hàng"
    });
  }
};

/**
 * Cập nhật trạng thái thanh toán
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updatePaymentStatus = (req, res) => {
  try {
    const { token, status } = req.body;
    
    if (!token || !status) {
      return res.status(400).json({ 
        success: false, 
        message: "Thiếu token hoặc trạng thái thanh toán" 
      });
    }
    
    // Kiểm tra token có tồn tại không
    if (!paymentSessions[token]) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phiên thanh toán với token này"
      });
    }
    
    // Cập nhật trạng thái
    paymentSessions[token].status = status;
    paymentSessions[token].updatedAt = new Date();
    
    return res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái thanh toán thành công",
      data: paymentSessions[token]
    });
    
  } catch (error) {
    console.log("Lỗi cập nhật trạng thái thanh toán:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server, không thể cập nhật trạng thái thanh toán"
    });
  }
};