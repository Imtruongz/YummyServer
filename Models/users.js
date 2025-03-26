import mongoose, { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  userId: {
    type: String,
    default: () => uuidv4(),
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
    select: false,
  },
  avatar: {
    type: String,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true
  },
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.models.User || model("User", userSchema);
