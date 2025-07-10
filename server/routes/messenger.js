const express = require('express');
const router = express.Router();
const MessengerService = require('../services/MessengerService');

// Send message to user
router.post('/send-message', async (req, res) => {
  try {
    const { recipientId, message, messageType = 'text' } = req.body;

    if (!recipientId || !message) {
      return res.status(400).json({
        error: 'recipientId and message are required'
      });
    }

    const result = await MessengerService.sendMessage(recipientId, message, messageType);
    
    res.json({
      success: true,
      messageId: result.message_id,
      recipientId: result.recipient_id
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      error: 'Failed to send message',
      details: error.message
    });
  }
});

// Get user profile
router.get('/user-profile/:psid', async (req, res) => {
  try {
    const { psid } = req.params;
    const profile = await MessengerService.getUserProfile(psid);
    
    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      error: 'Failed to get user profile',
      details: error.message
    });
  }
});

// Get conversations
router.get('/conversations', async (req, res) => {
  try {
    const conversations = await MessengerService.getConversations();
    
    res.json({
      success: true,
      conversations
    });
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({
      error: 'Failed to get conversations',
      details: error.message
    });
  }
});

// Mark conversation as read
router.post('/mark-read', async (req, res) => {
  try {
    const { psid } = req.body;
    
    if (!psid) {
      return res.status(400).json({
        error: 'psid is required'
      });
    }

    await MessengerService.markAsRead(psid);
    
    res.json({
      success: true,
      message: 'Conversation marked as read'
    });
  } catch (error) {
    console.error('Error marking as read:', error);
    res.status(500).json({
      error: 'Failed to mark as read',
      details: error.message
    });
  }
});

// Get conversation history
router.get('/conversation/:psid', async (req, res) => {
  try {
    const { psid } = req.params;
    const { limit = 20, offset = 0 } = req.query;
    
    const history = await MessengerService.getConversationHistory(psid, parseInt(limit), parseInt(offset));
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error getting conversation history:', error);
    res.status(500).json({
      error: 'Failed to get conversation history',
      details: error.message
    });
  }
});

// Send quick reply template
router.post('/send-quick-reply', async (req, res) => {
  try {
    const { recipientId, text, quickReplies } = req.body;

    if (!recipientId || !text || !quickReplies) {
      return res.status(400).json({
        error: 'recipientId, text, and quickReplies are required'
      });
    }

    const message = {
      text,
      quick_replies: quickReplies.map(reply => ({
        content_type: 'text',
        title: reply.title,
        payload: reply.payload
      }))
    };

    const result = await MessengerService.sendMessage(recipientId, message, 'quick_reply');
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error sending quick reply:', error);
    res.status(500).json({
      error: 'Failed to send quick reply',
      details: error.message
    });
  }
});

// Send button template
router.post('/send-button-template', async (req, res) => {
  try {
    const { recipientId, text, buttons } = req.body;

    if (!recipientId || !text || !buttons) {
      return res.status(400).json({
        error: 'recipientId, text, and buttons are required'
      });
    }

    const message = {
      payload: {
        template_type: 'button',
        text,
        buttons: buttons.map(button => ({
          type: button.type || 'postback',
          title: button.title,
          payload: button.payload || button.url
        }))
      }
    };

    const result = await MessengerService.sendMessage(recipientId, message, 'template');
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error sending button template:', error);
    res.status(500).json({
      error: 'Failed to send button template',
      details: error.message
    });
  }
});

// Get page info
router.get('/page-info', async (req, res) => {
  try {
    const pageInfo = await MessengerService.getPageInfo();
    
    res.json({
      success: true,
      data: pageInfo
    });
  } catch (error) {
    console.error('Error getting page info:', error);
    res.status(500).json({
      error: 'Failed to get page info',
      details: error.message
    });
  }
});

module.exports = router;