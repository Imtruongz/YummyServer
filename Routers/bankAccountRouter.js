import express from "express";
import { getBankAccount, getUserBankAccount, saveBankAccount, deleteBankAccount } from "../Controllers/bankAccountController.js";
import { authenticateToken } from "../Config/jwtConfig.js";

const bankAccountRouter = express.Router();

// Route để lấy tài khoản ngân hàng của người dùng
bankAccountRouter.get("/", authenticateToken, getBankAccount);

// Route để lấy tài khoản ngân hàng của một người dùng cụ thể theo userId
bankAccountRouter.get("/:userId", authenticateToken, getUserBankAccount);

// Route để lưu (thêm mới hoặc cập nhật) tài khoản ngân hàng
bankAccountRouter.post("/", authenticateToken, saveBankAccount);

// Route để xóa tài khoản ngân hàng
bankAccountRouter.delete("/", authenticateToken, deleteBankAccount);

export default bankAccountRouter;