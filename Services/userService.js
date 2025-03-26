import { User } from "../Models/users.js"; // Đảm bảo đường dẫn đúng
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../Config/jwtConfig.js";

export const registerUserService = async ({
  username,
  email,
  password,
}) => {
  // Kiểm tra trùng email
  const existingUserByEmail = await User.findOne({ email });
  if (existingUserByEmail) {
    throw new Error("Email đã được sử dụng");
  }

  // Tiến hành mã hóa mật khẩu và tạo người dùng mới
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    email,
    passwordHash,
  });

  await newUser.save();
  const accessToken = generateAccessToken(newUser);
  const refreshToken = generateRefreshToken(newUser);

  return {
    userId: newUser._id, // Đảm bảo trả về _id đúng của mongoDB
    accessToken,
    refreshToken,
  };
};

export const loginUserService = async ({ email, password, rememberMe }) => {
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    throw new Error("Sai email hoặc mật khẩu");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Sai email hoặc mật khẩu");
  }

  // Tạo access token
  const accessToken = generateAccessToken(user);
  console.log(accessToken);

  // Tạo refresh token với thời hạn phụ thuộc vào rememberMe
  const refreshToken = rememberMe
    ? generateRefreshToken(user, "7d")
    : generateRefreshToken(user, "1d");

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const updateUserService = async (userId, userData) => {
  const updateData = {
    ...userData,
    updatedAt: Date.now(),
  };

  const updatedUser = await User.findOneAndUpdate({ userId }, updateData, {
    new: true,
  });

  if (!updatedUser) {
    throw new Error("Người dùng không tồn tại");
  }

  return updatedUser;
};

export const changePasswordService = async (
  userId,
  oldPassword,
  newPassword
) => {
  const user = await User.findOne({ userId }).select("+passwordHash");

  if (!user) {
    throw new Error("Người dùng không tồn tại");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isMatch) {
    throw new Error("Mật khẩu cũ không chính xác");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  const updatedUser = await User.findOneAndUpdate(
    { userId },
    { passwordHash, updatedAt: Date.now() },
    { new: true }
  );

  return updatedUser;
};

// Xóa tài khoản người dùng
export const deleteUserService = async (userId) => {
  const deletedUser = await User.findOneAndDelete({ userId });

  if (!deletedUser) {
    throw new Error("Người dùng không tồn tại");
  }

  return { message: "Xóa tài khoản thành công" };
};

export const getAllUsersService = async (currentUserId) => {
  try {
    // Query MongoDB, loại bỏ người dùng hiện tại bằng cách sử dụng `$ne`
    const users = await User.find({ userId: { $ne: currentUserId } });

    return users; // Trả về danh sách người dùng
  } catch (error) {
    console.error(
      "Lỗi khi truy vấn danh sách người dùng trong service:",
      error
    );
    throw new Error("Lỗi khi truy vấn dữ liệu từ database");
  }
};

export const getUserByIdService = async (userId) => {
  try {
    return await User.findOne({ userId });
  } catch (error) {
    throw new Error("Lỗi khi truy vấn dữ liệu: " + error.message);
  }
};

export const getUserByEmailService = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    throw new Error("Lỗi khi truy vấn dữ liệu: " + error.message);
  }
};

export const loginWithFacebookService = async ({ facebookId, username, email, avatar }) => {
  // Tìm hoặc tạo người dùng mới dựa vào facebookId
  let user = await User.findOne({ facebookId });
  if (!user && email) {
    // Kiểm tra nếu email đã tồn tại
    user = await User.findOne({ email });
  }
  
  if (!user) {
    // Tạo người dùng mới
    user = new User({
      username,
      email,
      facebookId,
      avatar,
      passwordHash: await bcrypt.hash(Math.random().toString(36), 10) // Mật khẩu ngẫu nhiên
    });
    await user.save();
  } else if (!user.facebookId) {
    // Cập nhật facebookId nếu người dùng đã tồn tại
    user.facebookId = facebookId;
    await user.save();
  }
  
  // Tạo token
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  return {
    user,
    accessToken,
    refreshToken
  };
};
