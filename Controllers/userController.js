import {
  registerUserService,
  loginUserService,
  updateUserService,
  deleteUserService,
  getUserByIdService,
  getUserByEmailService,
  changePasswordService,
  getAllUsersService,
  loginWithFacebookService
} from "../Services/userService.js";

import { User } from "../Models/users.js";

export const registerUser = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Dữ liệu gửi lên không hợp lệ" });
  }

  const { username, email, password } = req.body;

  try {
    const result = await registerUserService({
      username,
      email,
      password,
    });
    res
      .status(201)
      .json({ message: "Đăng ký thành công", userId: result.userId });
  } catch (err) {
    if (err.message === "Email đã được sử dụng") {
      return res.status(400).json({ message: err.message });
    }

    console.error("Lỗi khi đăng ký người dùng:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
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
    console.error("Lỗi khi đăng nhập:", err);
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
    console.error("Lỗi khi cập nhật thông tin:", err);
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
    console.error("Lỗi khi đổi mật khẩu:", err);
    res.status(404).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const result = await deleteUserService(userId);
    res.json(result);
  } catch (err) {
    console.error("Lỗi khi xóa tài khoản:", err);
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
    console.error("Lỗi khi lấy danh sách người dùng:", err);
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
    console.error("Lỗi khi lấy thông tin user:", err);
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
    console.error("Lỗi khi lấy thông tin user:", err);
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
    console.error("Lỗi khi đăng nhập bằng Facebook:", err);
    res.status(400).json({ message: err.message });
  }
};
