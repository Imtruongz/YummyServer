import { UserFollow } from '../Models/userFollows.js';
import { User } from '../Models/users.js';

export const followService = {
  async follow(followerId, followingId) {
    if (followerId === followingId) throw new Error('Cannot follow yourself');
    return UserFollow.create({ followerId, followingId });
  },
  async unfollow(followerId, followingId) {
    return UserFollow.deleteOne({ followerId, followingId });
  },
  async getFollowers(userId) {
    // Lấy danh sách followerId
    const follows = await UserFollow.find({ followingId: userId }).select('followerId -_id');
    const ids = follows.map(f => f.followerId);
    if (ids.length === 0) return [];
    // Lấy thông tin user
    return User.find({ userId: { $in: ids } }).select('userId username avatar description');
  },
  async getFollowing(userId) {
    // Lấy danh sách followingId
    const follows = await UserFollow.find({ followerId: userId }).select('followingId -_id');
    const ids = follows.map(f => f.followingId);
    if (ids.length === 0) return [];
    // Lấy thông tin user
    return User.find({ userId: { $in: ids } }).select('userId username avatar description');
  },
  async isFollowing(followerId, followingId) {
    return !!(await UserFollow.findOne({ followerId, followingId }));
  },
  async countFollowers(userId) {
    return UserFollow.countDocuments({ followingId: userId });
  },
  async countFollowing(userId) {
    return UserFollow.countDocuments({ followerId: userId });
  },
};
