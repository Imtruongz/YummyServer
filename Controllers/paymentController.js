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
export const createPaymentSession = (req, res) => {
  try {
    // Bỏ qua dữ liệu từ req.body và sử dụng dữ liệu fix cứng
    
    // Tạo token duy nhất bằng timestamp và số ngẫu nhiên
    const token = `${Math.floor(Math.random() * 100000)}`;
    
    // Lưu thông tin vào database giả lập với dữ liệu fix cứng
    paymentSessions[token] = {
      bankName: "Military Commercial Joint Stock Bank - Laos branch",
      accountNumber: "100000427769",
      transactionAmount: 10000,
      bankCode: "MB",
      save: true,
      dataBank: {
        beneficiaryId: 2603,
        customerId: 21321,
        beneficiaryCustomerName: "HOANG NAM TIEN",
        customerAccNumber: "100000123042",
        beneficiaryAccountNumber: "100000427769",
        beneficiaryBankCode: "MB",
        beneficiaryBankName: "Military Commercial Joint Stock Bank - Laos branch",
        beneficiaryBankId: 8,
        reminiscentName: "HOANG NAM TIEN",
        status: 1,
        type: "INTERNAL_BANK",
        icon: {
          id: 8845,
          name: "unnamed.png",
          path: "8845/unnamed-2024-11-19.png",
          normalizeName: "unnamed-2024-11-19.png",
          classPk: 8
        },
        transferTransactionId: 21991,
        savedAccount: 1
      }
    };
    
    return res.status(200).json({
      success: true,
      token,
      message: "Tạo phiên thanh toán thành công"
    });
  } catch (error) {
    console.error("Lỗi tạo phiên thanh toán:", error);
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
    console.error("Lỗi lấy thông tin đơn hàng:", error);
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
    console.error("Lỗi cập nhật trạng thái thanh toán:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server, không thể cập nhật trạng thái thanh toán"
    });
  }
};