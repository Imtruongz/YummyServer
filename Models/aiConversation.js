import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const chatMessageSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  isUser: {
    type: Boolean,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const aiConversationSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 255,
    },
    messages: [chatMessageSchema],
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast querying user conversations
aiConversationSchema.index({ userId: 1, createdAt: -1 });

// Index for soft delete
aiConversationSchema.index({ userId: 1, isDeleted: 1 });

export const AiConversation = mongoose.model(
  'AiConversation',
  aiConversationSchema
);
