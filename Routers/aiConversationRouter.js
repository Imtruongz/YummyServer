import express from 'express';
import { authenticateToken } from '../Config/jwtConfig.js';
import {
  saveConversation,
  addMessage,
  getUserConversations,
  getConversationDetail,
  deleteConversation,
  updateConversationTitle,
  exportConversation,
} from '../Controllers/aiConversationController.js';

const router = express.Router();

// Middleware: Require authentication for all routes
router.use(authenticateToken);

// 1. POST /api/ai/conversations/save - Lưu conversation mới
router.post('/save', saveConversation);

// 2. POST /api/ai/conversations/:id/message - Thêm message
router.post('/:conversationId/message', addMessage);

// 3. GET /api/ai/conversations - Lấy danh sách conversations
router.get('/', getUserConversations);

// 4. GET /api/ai/conversations/:id - Lấy chi tiết
router.get('/:conversationId', getConversationDetail);

// 5. DELETE /api/ai/conversations/:id - Xóa conversation
router.delete('/:conversationId', deleteConversation);

// 6. PUT /api/ai/conversations/:id/title - Cập nhật title
router.put('/:conversationId/title', updateConversationTitle);

// 7. GET /api/ai/conversations/:id/export - Export conversation
router.get('/:conversationId/export', exportConversation);

export default router;
