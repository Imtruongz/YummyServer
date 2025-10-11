import BankAccount from '../Models/bankAccounts.js';
import { User } from '../Models/users.js';

/**
 * Lấy tài khoản ngân hàng của người dùng
 * @param {string} userId - ID của người dùng
 * @returns {Promise<Object|null>} - Tài khoản ngân hàng của người dùng hoặc null
 */
export const getBankAccount = async (userId) => {
  try {
    const bankAccount = await BankAccount.findOne({ userId });
    return bankAccount;
  } catch (error) {
    throw new Error(`Error getting bank account: ${error.message}`);
  }
};

/**
 * Thêm hoặc cập nhật tài khoản ngân hàng cho người dùng
 * @param {string} userId - ID của người dùng
 * @param {Object} bankAccountData - Thông tin tài khoản ngân hàng
 * @returns {Promise<Object>} - Tài khoản ngân hàng đã tạo hoặc cập nhật
 */
export const saveUserBankAccount = async (userId, bankAccountData) => {
  try {
    // Kiểm tra xem người dùng tồn tại không
    const user = await User.findOne({ userId: userId });
    if (!user) {
      throw new Error('User not found');
    }
    
    // Kiểm tra xem người dùng đã có tài khoản ngân hàng chưa
    let bankAccount = await BankAccount.findOne({ userId });
    
    if (bankAccount) {
      // Cập nhật tài khoản hiện có
      bankAccount.bankName = bankAccountData.bankName;
      bankAccount.bankCode = bankAccountData.bankCode;
      bankAccount.accountNumber = bankAccountData.accountNumber;
      bankAccount.accountName = bankAccountData.accountName;
    } else {
      // Tạo tài khoản ngân hàng mới
      bankAccount = new BankAccount({
        userId,
        bankName: bankAccountData.bankName,
        bankCode: bankAccountData.bankCode,
        accountNumber: bankAccountData.accountNumber,
        accountName: bankAccountData.accountName
      });
    }
    
    // Lưu tài khoản ngân hàng
    await bankAccount.save();
    
    return bankAccount;
  } catch (error) {
    throw new Error(`Error saving bank account: ${error.message}`);
  }
};

/**
 * Xóa tài khoản ngân hàng của người dùng
 * @param {string} userId - ID của người dùng
 * @returns {Promise<boolean>} - Kết quả xóa tài khoản
 */
export const deleteBankAccount = async (userId) => {
  try {
    const result = await BankAccount.deleteOne({ userId });
    return result.deletedCount > 0;
  } catch (error) {
    throw new Error(`Error deleting bank account: ${error.message}`);
  }
};

