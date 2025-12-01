import { AiConversation } from '../Models/aiConversation.js';
import { v4 as uuidv4 } from 'uuid';

// 1. Lưu hoặc cập nhật conversation
export const saveConversationService = async (userId, messages, title) => {
  try {
    // Auto-generate title từ first message nếu không có
    let conversationTitle = title;
    if (!conversationTitle && messages.length > 0) {
      const firstUserMessage = messages.find(msg => msg.isUser);
      conversationTitle = firstUserMessage 
        ? firstUserMessage.text.substring(0, 100) 
        : 'Cuộc trò chuyện mới';
    }

    // Validate
    if (!conversationTitle) {
      throw new Error('Title is required');
    }

    // Tạo conversation mới
    const conversation = new AiConversation({
      conversationId: uuidv4(),
      userId,
      title: conversationTitle,
      messages: messages.map(msg => ({
        id: uuidv4(),
        text: msg.text,
        isUser: msg.isUser,
        timestamp: new Date(),
      })),
      isDeleted: false,
    });

    await conversation.save();

    return {
      conversationId: conversation.conversationId,
      title: conversation.title,
      createdAt: conversation.createdAt,
    };
  } catch (error) {
    console.error('Error in saveConversationService:', error);
    throw error;
  }
};

// 2. Thêm message vào conversation
export const addMessageService = async (conversationId, message) => {
  try {
    const conversation = await AiConversation.findOneAndUpdate(
      { conversationId, isDeleted: false },
      {
        $push: {
          messages: {
            id: uuidv4(),
            text: message.text,
            isUser: message.isUser,
            timestamp: new Date(),
          },
        },
        $set: { updatedAt: new Date() },
      },
      { new: true, runValidators: true }
    );

    if (!conversation) {
      throw new Error('Conversation not found or has been deleted');
    }

    return conversation;
  } catch (error) {
    console.error('Error in addMessageService:', error);
    throw error;
  }
};

// 3. Lấy danh sách conversations của user (có pagination)
export const getUserConversationsService = async (
  userId,
  page = 1,
  limit = 20
) => {
  try {
    const skip = (page - 1) * limit;

    const conversations = await AiConversation.find({
      userId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('conversationId title createdAt updatedAt')
      .lean();

    // Add preview message (first message in conversation)
    const conversationsWithPreview = conversations.map(conv => {
      return {
        ...conv,
        previewMessage: 'Chat history',
      };
    });

    // Total count
    const totalCount = await AiConversation.countDocuments({
      userId,
      isDeleted: false,
    });

    const hasMore = skip + limit < totalCount;

    return {
      conversations: conversationsWithPreview,
      totalCount,
      hasMore,
      currentPage: page,
    };
  } catch (error) {
    console.error('Error in getUserConversationsService:', error);
    throw error;
  }
};

// 4. Lấy chi tiết 1 conversation
export const getConversationDetailService = async (
  conversationId,
  userId
) => {
  try {
    const conversation = await AiConversation.findOne({
      conversationId,
      userId,
      isDeleted: false,
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return {
      conversationId: conversation.conversationId,
      title: conversation.title,
      messages: conversation.messages,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  } catch (error) {
    console.error('Error in getConversationDetailService:', error);
    throw error;
  }
};

// 5. Xóa conversation (soft delete)
export const deleteConversationService = async (conversationId, userId) => {
  try {
    const conversation = await AiConversation.findOneAndUpdate(
      { conversationId, userId },
      { $set: { isDeleted: true, updatedAt: new Date() } },
      { new: true }
    );

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteConversationService:', error);
    throw error;
  }
};

// 6. Cập nhật title
export const updateConversationTitleService = async (
  conversationId,
  userId,
  newTitle
) => {
  try {
    // Validate title
    if (!newTitle || newTitle.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }

    if (newTitle.length > 255) {
      throw new Error('Title must be 255 characters or less');
    }

    const conversation = await AiConversation.findOneAndUpdate(
      { conversationId, userId, isDeleted: false },
      {
        $set: {
          title: newTitle.trim(),
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return {
      conversationId: conversation.conversationId,
      title: conversation.title,
    };
  } catch (error) {
    console.error('Error in updateConversationTitleService:', error);
    throw error;
  }
};

// 7. Cleanup: Xóa conversations cũ nhất khi > 100
export const cleanupOldConversationsService = async (userId) => {
  try {
    const count = await AiConversation.countDocuments({
      userId,
      isDeleted: false,
    });

    if (count > 100) {
      // Lấy 20 conversations cũ nhất
      const oldConversations = await AiConversation.find({
        userId,
        isDeleted: false,
      })
        .sort({ createdAt: 1 })
        .limit(20)
        .select('conversationId');

      const idsToDelete = oldConversations.map(conv => conv.conversationId);

      // Soft delete
      await AiConversation.updateMany(
        { conversationId: { $in: idsToDelete } },
        { $set: { isDeleted: true, updatedAt: new Date() } }
      );

      return {
        cleaned: true,
        deletedCount: idsToDelete.length,
        newTotal: count - idsToDelete.length,
      };
    }

    return {
      cleaned: false,
      totalCount: count,
    };
  } catch (error) {
    console.error('Error in cleanupOldConversationsService:', error);
    throw error;
  }
};

// 8. Export conversation as JSON
export const exportConversationService = async (conversationId, userId) => {
  try {
    const conversation = await AiConversation.findOne({
      conversationId,
      userId,
      isDeleted: false,
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return {
      title: conversation.title,
      messages: conversation.messages,
      createdAt: conversation.createdAt,
      exportedAt: new Date(),
    };
  } catch (error) {
    console.error('Error in exportConversationService:', error);
    throw error;
  }
};
