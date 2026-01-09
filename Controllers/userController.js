import {
  registerUserService,
  loginUserService,
  updateUserService,
  deleteUserService,
  getUserByIdService,
  getUserByEmailService,
  changePasswordService,
  getAllUsersService,
  getPopularCreatorsService,
  loginWithFacebookService,
  verifyEmailService,
  resendVerificationEmailService,
  forgotPasswordService,
  verifyCodeAndResetPasswordService,
} from "../Services/userService.js";

import { User } from "../Models/users.js";

export const registerUser = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Dữ liệu gửi lên không hợp lệ" });
  }

  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email và mật khẩu không được để trống" });
  }

  if (typeof username !== 'string' || username.trim().length < 3) {
    return res.status(400).json({ message: "Username phải có ít nhất 3 ký tự" });
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ message: "Email không hợp lệ" });
  }

  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
  }

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

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email và mật khẩu không được để trống" });
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ message: "Email không hợp lệ" });
  }

  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
  }

  try {
    const result = await loginUserService({ email, password, rememberMe });
    res.json({
      message: "Đăng nhập thành công",
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
      warning: result.warning || undefined, // Return warning if email not verified
    });
  } catch (err) {
    console.log("Lỗi khi đăng nhập:", err);
    res.status(400).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  const { username, avatar, description } = req.body;
  const userId = req.user?.userId; // Lấy userId từ JWT token

  if (!userId) {
    return res.status(401).json({ message: "Không tìm thấy thông tin người dùng" });
  }

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

/**
 * GET /users/popular-creators
 * Get popular creators sorted by followers and food count
 */
export const getPopularCreators = async (req, res) => {
  const userId = req.user.userId;
  const limit = parseInt(req.query.limit) || 10; // Default 10 creators

  try {
    const creators = await getPopularCreatorsService(userId, limit);
    res.json(creators);
  } catch (err) {
    console.log("Lỗi khi lấy popular creators:", err);
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

  // userData is optional (can be used for signup flow only)
  if (userData && (!userData.username || !userData.password)) {
    return res.status(400).json({
      message: "Form data (username, password) không hợp lệ"
    });
  }

  try {
    // ✅ If userData is provided, create user (signup flow)
    // ✅ If userData is not provided, just verify code (forgot password flow)
    const result = await verifyEmailService(email, verificationCode, userData);

    if (userData) {
      // Signup flow - return user + tokens
      res.json({
        message: result.message,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      });
    } else {
      // Forgot password flow - just confirm code is valid
      res.json({
        message: result.message || "Verification code is valid",
      });
    }
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

/**
 * POST /users/forgot-password
 * User nhập email để quên mật khẩu
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await forgotPasswordService(email);
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error in forgotPassword:", error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * POST /users/verify-reset-code
 * User nhập code xác minh + password mới để reset password
 */
export const verifyResetCode = async (req, res) => {
  try {
    const { email, verificationCode, newPassword } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!verificationCode) {
      return res.status(400).json({ message: "Verification code is required" });
    }
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const result = await verifyCodeAndResetPasswordService(
      email,
      verificationCode,
      newPassword
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error in verifyResetCode:", error);
    res.status(400).json({ message: error.message });
  }
};
