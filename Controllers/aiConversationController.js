import {
  saveConversationService,
  addMessageService,
  getUserConversationsService,
  getConversationDetailService,
  deleteConversationService,
  updateConversationTitleService,
  cleanupOldConversationsService,
  exportConversationService,
} from '../Services/aiConversationService.js';

// 1. Lưu conversation mới
export const saveConversation = async (req, res) => {
  try {
    const { messages, title } = req.body;
    const userId = req.user.userId;

    // Validate
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ message: 'Messages array is required and cannot be empty' });
    }

    const result = await saveConversationService(userId, messages, title);

    // Cleanup if exceeded 100 conversations
    await cleanupOldConversationsService(userId);

    res.status(201).json({
      message: 'Conversation saved successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error in saveConversation:', error);
    res.status(500).json({ message: error.message });
  }
};

// 2. Thêm message vào conversation
export const addMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { message } = req.body;
    const userId = req.user.userId;

    // Validate
    if (!conversationId) {
      return res
        .status(400)
        .json({ message: 'Conversation ID is required' });
    }

    if (!message || !message.text) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    // Verify conversation belongs to user
    const conversation = await require('../Models/aiConversation.js').AiConversation.findOne({
      conversationId,
      userId,
      isDeleted: false,
    });

    if (!conversation) {
      return res.status(404).json({
        message: 'Conversation not found or access denied',
      });
    }

    const result = await addMessageService(conversationId, message);

    res.status(200).json({
      message: 'Message added successfully',
      data: {
        conversationId: result.conversationId,
        messages: result.messages,
      },
    });
  } catch (error) {
    console.error('Error in addMessage:', error);
    res.status(500).json({ message: error.message });
  }
};

// 3. Lấy danh sách conversations
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;

    // Validate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    const result = await getUserConversationsService(userId, pageNum, limitNum);

    res.status(200).json({
      message: 'Conversations retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error in getUserConversations:', error);
    res.status(500).json({ message: error.message });
  }
};

// 4. Lấy chi tiết conversation
export const getConversationDetail = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    if (!conversationId) {
      return res
        .status(400)
        .json({ message: 'Conversation ID is required' });
    }

    const result = await getConversationDetailService(conversationId, userId);

    res.status(200).json({
      message: 'Conversation detail retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error in getConversationDetail:', error);
    res.status(error.message.includes('not found') ? 404 : 500).json({
      message: error.message,
    });
  }
};

// 5. Xóa conversation
export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    if (!conversationId) {
      return res
        .status(400)
        .json({ message: 'Conversation ID is required' });
    }

    const result = await deleteConversationService(conversationId, userId);

    res.status(200).json({
      message: 'Conversation deleted successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error in deleteConversation:', error);
    res.status(error.message.includes('not found') ? 404 : 500).json({
      message: error.message,
    });
  }
};

// 6. Cập nhật title
export const updateConversationTitle = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { title } = req.body;
    const userId = req.user.userId;

    // Validate
    if (!conversationId) {
      return res
        .status(400)
        .json({ message: 'Conversation ID is required' });
    }

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const result = await updateConversationTitleService(
      conversationId,
      userId,
      title
    );

    res.status(200).json({
      message: 'Conversation title updated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error in updateConversationTitle:', error);
    res.status(error.message.includes('not found') ? 404 : 400).json({
      message: error.message,
    });
  }
};

// 7. Export conversation
export const exportConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    if (!conversationId) {
      return res
        .status(400)
        .json({ message: 'Conversation ID is required' });
    }

    const result = await exportConversationService(conversationId, userId);

    res.status(200).json({
      message: 'Conversation exported successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error in exportConversation:', error);
    res.status(error.message.includes('not found') ? 404 : 500).json({
      message: error.message,
    });
  }
};
