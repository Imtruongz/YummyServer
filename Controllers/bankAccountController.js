import * as bankAccountService from '../Services/bankAccountService.js';

/**
 * Lấy tài khoản ngân hàng của người dùng khác theo userId
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserBankAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId không hợp lệ"
      });
    }
    
    const bankAccount = await bankAccountService.getBankAccount(userId);
    
    if (!bankAccount) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin tài khoản ngân hàng của người dùng này"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: bankAccount,
      exists: true
    });
  } catch (error) {
    console.error('Error getting user bank account:', error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server, không thể lấy thông tin tài khoản ngân hàng"
    });
  }
};

/**
 * Lấy tài khoản ngân hàng của người dùng
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getBankAccount = async (req, res) => {
  try {
    const userId = req.user.userId; // Lấy ID người dùng từ JWT token
    
    const bankAccount = await bankAccountService.getBankAccount(userId);
    
    return res.status(200).json({
      success: true,
      data: bankAccount,
      exists: bankAccount !== null
    });
  } catch (error) {
    console.error('Error getting bank account:', error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server, không thể lấy thông tin tài khoản ngân hàng"
    });
  }
};

/**
 * Lưu tài khoản ngân hàng (thêm mới hoặc cập nhật)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const saveBankAccount = async (req, res) => {
  try {
    const userId = req.user.userId; // Lấy ID người dùng từ JWT token
    const { bankName, bankCode, accountNumber, accountName } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!bankName || !bankCode || !accountNumber || !accountName) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin tài khoản ngân hàng"
      });
    }
    
    const bankAccount = await bankAccountService.saveUserBankAccount(userId, {
      bankName,
      bankCode,
      accountNumber,
      accountName
    });
    
    return res.status(200).json({
      success: true,
      data: bankAccount,
      message: "Lưu tài khoản ngân hàng thành công"
    });
  } catch (error) {
    console.error('Error saving bank account:', error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server, không thể lưu tài khoản ngân hàng"
    });
  }
};

/**
 * Xóa tài khoản ngân hàng
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteBankAccount = async (req, res) => {
  try {
    const userId = req.user.userId; // Lấy ID người dùng từ JWT token
    
    const result = await bankAccountService.deleteBankAccount(userId);
    
    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Thiếu ID tài khoản ngân hàng"
      });
    }
    
    const updatedAccount = await bankAccountService.updateBankAccount(accountId, userId, {
      bankName,
      bankCode,
      accountNumber,
      accountName,
      isDefault
    });
    
    return res.status(200).json({
      success: true,
      data: updatedAccount,
      message: "Cập nhật tài khoản ngân hàng thành công"
    });
  } catch (error) {
    console.error('Error updating bank account:', error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server, không thể cập nhật tài khoản ngân hàng"
    });
  }
};

/**
 * Đặt tài khoản làm mặc định
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const setDefaultBankAccount = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy ID người dùng từ JWT token
    const { accountId } = req.params;
    
    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy tài khoản ngân hàng"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Xóa tài khoản ngân hàng thành công"
    });
  } catch (error) {
    console.error('Error deleting bank account:', error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server, không thể xóa tài khoản ngân hàng"
    });
  }
};

