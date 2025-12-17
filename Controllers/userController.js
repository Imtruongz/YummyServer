// Cập nhật FCM token cho user
export const updateFcmToken = async (req, res) => {
  const userId = req.user.userId;
  const { fcmToken } = req.body;
  if (!fcmToken) {
    return res.status(400).json({ message: 'FCM token is required.' });
  }
  try {
    const user = await User.findOneAndUpdate(
      { userId },
      { fcmToken },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    console.log(`[FCM] UserId: ${userId} cập nhật FCM token: ${fcmToken}`);
    res.status(200).json({ message: 'FCM token updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import {
  registerUserService,
  loginUserService,
  updateUserService,
  deleteUserService,
  getUserByIdService,
  getUserByEmailService,
  changePasswordService,
  getAllUsersService,
  loginWithFacebookService,
  verifyEmailService,
  resendVerificationEmailService
} from "../Services/userService.js";

import { User } from "../Models/users.js";

export const registerUser = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Dữ liệu gửi lên không hợp lệ" });
  }

  const { username, email, password } = req.body;

  console.log("📝 [REGISTER] Received registration request:");
  console.log("   Username:", username);
  console.log("   Email:", email);
  console.log("   Password length:", password?.length || 0);

  try {
    // ✅ Chỉ gửi email, không lưu user vào DB
    const result = await registerUserService({
      username,
      email,
      password,
    });
    console.log("✅ [REGISTER] Verification email sent to:", email);
    res.status(201).json({ 
      message: result.message,
      email: result.email
    });
  } catch (err) {
    if (err.message === "Email đã được sử dụng" || err.message.includes("đang chờ xác thực")) {
      console.log("⚠️ [REGISTER] Email already exists or pending:", email);
      return res.status(400).json({ message: err.message });
    }

    console.log("❌ [REGISTER] Error:", err.message);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({ 
      message: "Lỗi máy chủ",
      error: err.message 
    });
  }
};

// Đăng nhập người dùng
export const loginUser = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    const result = await loginUserService({ email, password, rememberMe });
    res.json({
      message: "Đăng nhập thành công",
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (err) {
    console.log("Lỗi khi đăng nhập:", err);
    res.status(400).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  const { userId, username, avatar, description } = req.body;

  try {
    const updatedUser = await updateUserService(userId, {
      username,
      avatar,
      description,
    });
    res.json({ message: "Cập nhật thành công", updatedUser });
  } catch (err) {
    console.log("Lỗi khi cập nhật thông tin:", err);
    res.status(404).json({ message: err.message });
  }
};

//Change password
export const changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    const result = await changePasswordService(
      userId,
      oldPassword,
      newPassword
    );
    res.json(result);
  } catch (err) {
    console.log("Lỗi khi đổi mật khẩu:", err);
    res.status(404).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const result = await deleteUserService(userId);
    res.json(result);
  } catch (err) {
    console.log("Lỗi khi xóa tài khoản:", err);
    res.status(404).json({ message: err.message });
  }
};

export const getAllUser = async (req, res) => {
  const userId = req.user.userId;

  try {
    const users = await getAllUsersService(userId);
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy user nào" });
    }
    res.json(users);
  } catch (err) {
    console.log("Lỗi khi lấy danh sách người dùng:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await getUserByIdService(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }
    res.json(user);
  } catch (err) {
    console.log("Lỗi khi lấy thông tin user:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const getUserByEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await getUserByEmailService(email);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }
    res.json(user);
  } catch (err) {
    console.log("Lỗi khi lấy thông tin user:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Đăng nhập bằng Facebook
export const loginWithFacebook = async (req, res) => {
  const { userId, username, email, avatar } = req.body;

  try {
    const result = await loginWithFacebookService({ 
      facebookId: userId, 
      username, 
      email, 
      avatar 
    });
    
    res.json({
      message: "Đăng nhập thành công",
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (err) {
    console.log("Lỗi khi đăng nhập bằng Facebook:", err);
    res.status(400).json({ message: err.message });
  }
};

// ← NEW: Verify email with code
export const verifyEmail = async (req, res) => {
  const { email, verificationCode, userData } = req.body;

  if (!email || !verificationCode) {
    return res.status(400).json({ 
      message: "Email và mã xác nhận là bắt buộc" 
    });
  }

  if (!userData || !userData.username || !userData.password) {
    return res.status(400).json({ 
      message: "Form data (username, password) là bắt buộc" 
    });
  }

  try {
    // ✅ Gửi userData từ frontend
    const result = await verifyEmailService(email, verificationCode, userData);
    res.json({
      message: result.message,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (err) {
    console.log("Lỗi khi xác nhận email:", err);
    res.status(400).json({ message: err.message });
  }
};

// ← NEW: Resend verification email
export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email là bắt buộc" });
  }

  try {
    const result = await resendVerificationEmailService(email);
    res.json(result);
  } catch (err) {
    console.log("Lỗi khi gửi lại mã xác nhận:", err);
    res.status(400).json({ message: err.message });
  }
};
