import express from "express";
import { getOrderInfo, createPaymentSession, updatePaymentStatus } from "../Controllers/paymentController.js";

const paymentRouter = express.Router();

// Route để lấy thông tin đơn hàng dựa vào token
paymentRouter.get("/order-info", getOrderInfo);

// Route để tạo phiên thanh toán mới
paymentRouter.post("/create-session", createPaymentSession);

// Route để cập nhật trạng thái thanh toán
paymentRouter.post("/update-status", updatePaymentStatus);

export default paymentRouter;