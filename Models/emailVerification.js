import mongoose, { model, Schema } from "mongoose";

const emailVerificationSchema = new Schema({
  userId: {
    type: String,
    required: false, // ← Changed to false (tạm thời không cần userId)
    unique: false,
    sparse: true, // Cho phép multiple null values
    index: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true, // Email phải unique
    index: true,
  },
  verificationCode: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // Auto delete after expiration
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  maxAttempts: {
    type: Number,
    default: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const EmailVerification =
  mongoose.models.EmailVerification ||
  model("EmailVerification", emailVerificationSchema);
