import mongoose from 'mongoose';


const userFollowSchema = new mongoose.Schema({
  followerId: {
    type: String, // UUID userId
    required: true,
    ref: 'User',
  },
  followingId: {
    type: String, // UUID userId
    required: true,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userFollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export const UserFollow = mongoose.model('UserFollow', userFollowSchema);
