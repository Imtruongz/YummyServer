import express from "express";
import { getOrderInfo, createPaymentSession, updatePaymentStatus, getPaymentSession, paymentCallback } from "../Controllers/paymentController.js";

const paymentRouter = express.Router();

// Route để tạo phiên thanh toán mới
paymentRouter.post("/create-session", createPaymentSession);

// ✨ Route để MBLaos query thông tin giao dịch từ token
paymentRouter.get("/get-session", getPaymentSession);

// ✨ Route để lấy thông tin đơn hàng (backward compatibility)
paymentRouter.get("/order-info", getOrderInfo);

// ✨ Route để MBLaos gọi callback sau khi xử lý thanh toán
paymentRouter.post("/callback", paymentCallback);

// ✨ Route để cập nhật trạng thái (backward compatibility)
paymentRouter.post("/update-status", updatePaymentStatus);

// ✨ Route để Client đăng ký transaction cần theo dõi (Polling)
import { registerTransaction } from "../Controllers/paymentController.js";
paymentRouter.post("/register-transaction", registerTransaction);

export default paymentRouter;