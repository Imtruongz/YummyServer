import { User } from "../Models/users.js"; // Đảm bảo đường dẫn đúng
import PendingUser from "../Models/pendingUser.js";
import { EmailVerification } from "../Models/emailVerification.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../Config/jwtConfig.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
} from "./emailService.js";

export const registerUserService = async ({
  username,
  email,
  password,
  fullName,
}) => {
  console.log("🔧 [SERVICE] registerUserService started");
  
  // Kiểm tra trùng email trong User
  console.log("🔍 Checking if email exists in User collection:", email);
  const existingUserByEmail = await User.findOne({ email });
  if (existingUserByEmail) {
    console.log("⚠️ Email already exists in User collection");
    throw new Error("Email đã được sử dụng");
  }

  // Kiểm tra trùng email trong PendingUser
  console.log("🔍 Checking if email exists in PendingUser collection:", email);
  const existingPendingUser = await PendingUser.findOne({ email });
  if (existingPendingUser) {
    console.log("⚠️ Email already exists in PendingUser collection");
    throw new Error("Email này đang chờ xác thực. Vui lòng kiểm tra email.");
  }

  // ✅ Không lưu user vào DB, chỉ gửi email xác thực
  console.log("✅ Email is unique, sending verification email only");

  // Tạo verification code (6 digits)
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

  console.log("📧 Creating verification record with code:", verificationCode);
  // Lưu verification record (sử dụng email làm identifier)
  await EmailVerification.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      email: email.toLowerCase(),
      verificationCode,
      expiresAt,
      isUsed: false,
      attempts: 0,
    },
    { upsert: true, new: true }
  );

  console.log("📨 Sending verification email to:", email);
  // Gửi email verification
  await sendVerificationEmail(email, verificationCode);

  console.log("✅ Verification email sent - waiting for email verification");
  return {
    email,
    message: "Verification email sent. Please check your email.",
  };
};

export const loginUserService = async ({ email, password, rememberMe }) => {
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    throw new Error("Sai email hoặc mật khẩu");
  }

  // ← NEW: Kiểm tra email verification
  if (!user.isEmailVerified) {
    throw new Error("Email chưa được xác nhận. Vui lòng kiểm tra email của bạn.");
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
    console.log(
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

// ← NEW: Verify email with code
export const verifyEmailService = async (email, verificationCode, userData) => {
  console.log("🔍 [VERIFY] Starting verification for email:", email);
  console.log("🔍 [VERIFY] Code received (type:", typeof verificationCode, "):", verificationCode);
  
  // Tìm verification record
  const verificationRecord = await EmailVerification.findOne({
    email: email.toLowerCase(),
    isUsed: false,
  });

  console.log("🔍 [VERIFY] Record found:", verificationRecord ? 'YES' : 'NO');
  
  if (!verificationRecord) {
    throw new Error("Mã xác nhận không tồn tại hoặc đã hết hạn");
  }

  console.log("🔍 [VERIFY] DB Code (type:", typeof verificationRecord.verificationCode, "):", verificationRecord.verificationCode);
  console.log("🔍 [VERIFY] Comparing:", verificationRecord.verificationCode, "===", verificationCode.toString());

  // Kiểm tra mã hết hạn
  if (new Date() > verificationRecord.expiresAt) {
    throw new Error("Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.");
  }

  // Kiểm tra vượt quá số lần thử
  if (verificationRecord.attempts >= (verificationRecord.maxAttempts || 5)) {
    throw new Error("Đã vượt quá số lần thử. Vui lòng yêu cầu mã mới.");
  }

  // Kiểm tra mã xác nhận
  if (verificationRecord.verificationCode !== verificationCode.toString()) {
    console.log("❌ [VERIFY] Code mismatch!");
    // Tăng số lần thử
    verificationRecord.attempts += 1;
    await verificationRecord.save();
    throw new Error("Mã xác nhận không chính xác");
  }

  console.log("✅ [VERIFY] Code matched! Creating user from frontend data");

  // ✅ Lấy form data từ frontend (userData) và tạo User
  const { username, password } = userData;
  
  // Mã hóa mật khẩu
  const passwordHash = await bcrypt.hash(password, 10);
  
  // Tạo real user
  const newUser = new User({
    username,
    email: email.toLowerCase(),
    passwordHash,
    isEmailVerified: true,
  });

  await newUser.save();
  console.log("✅ User created in User collection:", newUser.userId);

  // Đánh dấu verification code đã sử dụng
  verificationRecord.isUsed = true;
  await verificationRecord.save();

  // Gửi welcome email
  await sendWelcomeEmail(email, username);

  // Tạo tokens (nhưng không trả về - user phải login)
  const accessToken = generateAccessToken(newUser);
  const refreshToken = generateRefreshToken(newUser);

  return {
    user: newUser,
    accessToken,
    refreshToken,
    message: "Email verified successfully!",
  };
};

// ← NEW: Resend verification code
export const resendVerificationEmailService = async (email) => {
  // Tìm pending user
  const pendingUser = await PendingUser.findOne({ email: email.toLowerCase() });
  if (!pendingUser) {
    throw new Error("Email không tồn tại hoặc đã được xác thực");
  }

  // Tạo verification code mới
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

  // Cập nhật verification record
  await EmailVerification.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      email: email.toLowerCase(),
      verificationCode,
      expiresAt,
      isUsed: false,
      attempts: 0,
    },
    { upsert: true, new: true }
  );

  // Gửi email
  await sendVerificationEmail(email, verificationCode);

  return {
    message: "Verification email sent. Please check your email.",
  };
};
