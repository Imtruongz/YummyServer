import mongoose from 'mongoose';

const bankAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: 'User',
      required: true,
      unique: true // Đảm bảo mỗi người dùng chỉ có 1 tài khoản ngân hàng
    },
    bankName: {
      type: String,
      required: true
    },
    bankCode: {
      type: String,
      required: true
    },
    accountNumber: {
      type: String,
      required: true
    },
    accountName: {
      type: String,
      required: true
    }
    // Đã loại bỏ isDefault vì mỗi người dùng chỉ có 1 tài khoản
  },
  {
    timestamps: true
  }
);

// Không cần middleware đặc biệt vì mỗi người dùng chỉ có một tài khoản

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);
export default BankAccount;