import { followService } from '../Services/followService.js';

export const followController = {
  async follow(req, res) {
    try {
      const { followerId, followingId } = req.body;
      if (!followerId || !followingId) return res.status(400).json({ message: 'Missing params' });
      await followService.follow(followerId, followingId);
      res.json({ message: 'Followed successfully' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  async unfollow(req, res) {
    try {
      const { followerId, followingId } = req.body;
      if (!followerId || !followingId) return res.status(400).json({ message: 'Missing params' });
      await followService.unfollow(followerId, followingId);
      res.json({ message: 'Unfollowed successfully' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  async getFollowers(req, res) {
    try {
      const { userId } = req.params;
  const followers = await followService.getFollowers(userId);
  // Trả về mảng user: { userId, username, avatar, description }
  res.json(followers);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  async getFollowing(req, res) {
    try {
      const { userId } = req.params;
  const following = await followService.getFollowing(userId);
  // Trả về mảng user: { userId, username, avatar, description }
  res.json(following);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  async isFollowing(req, res) {
    try {
      const { followerId, followingId } = req.query;
      if (!followerId || !followingId) return res.status(400).json({ message: 'Missing params' });
      const isFollow = await followService.isFollowing(followerId, followingId);
      res.json({ isFollow });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  async countFollowers(req, res) {
    try {
      const { userId } = req.params;
      const count = await followService.countFollowers(userId);
      res.json({ count });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  async countFollowing(req, res) {
    try {
      const { userId } = req.params;
      const count = await followService.countFollowing(userId);
      res.json({ count });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};
