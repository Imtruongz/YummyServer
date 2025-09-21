import express from 'express';
import { followController } from '../Controllers/followController.js';

const followRouter = express.Router();

// Theo dõi
followRouter.post('/', followController.follow);
// Bỏ theo dõi
followRouter.delete('/', followController.unfollow);
// Lấy danh sách followers
followRouter.get('/followers/:userId', followController.getFollowers);
// Lấy danh sách following
followRouter.get('/following/:userId', followController.getFollowing);
// Kiểm tra trạng thái follow
followRouter.get('/status', followController.isFollowing);
// Đếm số followers
followRouter.get('/followers/:userId/count', followController.countFollowers);
// Đếm số following
followRouter.get('/following/:userId/count', followController.countFollowing);

export default followRouter;
