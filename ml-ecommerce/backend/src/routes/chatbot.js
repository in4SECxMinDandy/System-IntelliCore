// ==========================================
// Chatbot Routes
// ==========================================

const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const chatbotController = require('../controllers/chatbotController');

// POST /api/chatbot/message — Process message (optional auth)
router.post('/message', optionalAuth, chatbotController.processMessage);

// GET /api/chatbot/history/:sessionId
router.get('/history/:sessionId', chatbotController.getChatHistory);

// DELETE /api/chatbot/history/:sessionId
router.delete('/history/:sessionId', chatbotController.clearChatHistory);

module.exports = router;
