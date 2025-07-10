const axios = require('axios');

class MessengerService {
  constructor() {
    this.pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    this.apiUrl = 'https://graph.facebook.com/v18.0/me';
    
    // In-memory storage for development (replace with database in production)
    this.conversations = new Map();
    this.messages = new Map();
  }

  // Send message to user
  async sendMessage(recipientId, message, messageType = 'text') {
    try {
      let messageData;

      switch (messageType) {
        case 'text':
          messageData = {
            text: message
          };
          break;
        case 'quick_reply':
          messageData = {
            text: message.text,
            quick_replies: message.quick_replies
          };
          break;
        case 'template':
          messageData = {
            attachment: {
              type: 'template',
              payload: message.payload
            }
          };
          break;
        default:
          messageData = { text: message };
      }

      const requestBody = {
        recipient: {
          id: recipientId
        },
        message: messageData,
        messaging_type: 'RESPONSE'
      };

      const response = await axios.post(`${this.apiUrl}/messages`, requestBody, {
        params: {
          access_token: this.pageAccessToken
        }
      });

      console.log('✅ Message sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error sending message:', error.response?.data || error.message);
      throw error;
    }
  }

  // Handle incoming messages
  async handleMessage(senderPsid, receivedMessage) {
    try {
      console.log(`📨 Processing message from ${senderPsid}:`, receivedMessage);

      // Get user profile
      const userProfile = await this.getUserProfile(senderPsid);
      
      // Store message in your database here
      await this.storeMessage({
        psid: senderPsid,
        message: receivedMessage,
        userProfile,
        timestamp: new Date(),
        direction: 'incoming'
      });

      // Auto-respond or process the message
      if (receivedMessage.text) {
        const response = await this.processTextMessage(receivedMessage.text, userProfile);
        if (response) {
          await this.sendMessage(senderPsid, response);
        }
      }

      // Notify frontend about new message
      this.notifyFrontend('new_message', {
        psid: senderPsid,
        message: receivedMessage,
        userProfile
      });

    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  // Handle postbacks
  async handlePostback(senderPsid, receivedPostback) {
    try {
      console.log(`📨 Processing postback from ${senderPsid}:`, receivedPostback);

      const payload = receivedPostback.payload;
      
      // Handle different postback payloads
      switch (payload) {
        case 'GET_STARTED':
          await this.sendWelcomeMessage(senderPsid);
          break;
        case 'HELP':
          await this.sendHelpMessage(senderPsid);
          break;
        default:
          console.log(`Unknown postback payload: ${payload}`);
      }
    } catch (error) {
      console.error('Error handling postback:', error);
    }
  }

  // Get user profile
  async getUserProfile(psid) {
    try {
      const response = await axios.get(`https://graph.facebook.com/v18.0/${psid}`, {
        params: {
          fields: 'first_name,last_name,profile_pic',
          access_token: this.pageAccessToken
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error getting user profile:', error.response?.data || error.message);
      return null;
    }
  }

  // Process text messages
  async processTextMessage(text, userProfile) {
    const lowerText = text.toLowerCase();

    // Simple keyword responses
    if (lowerText.includes('olá') || lowerText.includes('oi') || lowerText.includes('bom dia')) {
      return `Olá ${userProfile?.first_name || 'cliente'}! 👋 Como posso ajudá-lo hoje?`;
    }

    if (lowerText.includes('preço') || lowerText.includes('valor') || lowerText.includes('quanto custa')) {
      return 'Vou verificar os preços para você! Um momento... 💰';
    }

    if (lowerText.includes('ajuda') || lowerText.includes('help')) {
      return 'Estou aqui para ajudar! Você pode me perguntar sobre nossos produtos e serviços. 🤝';
    }

    // Default response for unrecognized messages
    return null; // Don't auto-respond to everything
  }

  // Send welcome message
  async sendWelcomeMessage(psid) {
    const userProfile = await this.getUserProfile(psid);
    const welcomeMessage = `Bem-vindo ${userProfile?.first_name || 'cliente'}! 🎉\n\nSou seu assistente virtual. Como posso ajudá-lo hoje?`;
    
    await this.sendMessage(psid, welcomeMessage);
  }

  // Send help message
  async sendHelpMessage(psid) {
    const helpMessage = `🆘 Central de Ajuda\n\nVocê pode me perguntar sobre:\n• Produtos e serviços\n• Preços e condições\n• Suporte técnico\n\nEstou aqui para ajudar! 😊`;
    
    await this.sendMessage(psid, helpMessage);
  }

  // Mark conversation as read
  async markAsRead(psid) {
    try {
      const requestBody = {
        recipient: {
          id: psid
        },
        sender_action: 'mark_seen'
      };

      await axios.post(`${this.apiUrl}/messages`, requestBody, {
        params: {
          access_token: this.pageAccessToken
        }
      });

      console.log('✅ Conversation marked as read');
    } catch (error) {
      console.error('❌ Error marking as read:', error.response?.data || error.message);
      throw error;
    }
  }

  // Store message in database (implement your database logic here)
  async storeMessage(messageData) {
    try {
      const conversationId = messageData.psid;
      
      // Store in memory (replace with database in production)
      if (!this.messages.has(conversationId)) {
        this.messages.set(conversationId, []);
      }
      
      const messageRecord = {
        id: Date.now().toString(),
        psid: messageData.psid,
        text: messageData.message.text || '',
        timestamp: messageData.timestamp,
        direction: messageData.direction,
        userProfile: messageData.userProfile
      };
      
      this.messages.get(conversationId).push(messageRecord);
      
      // Update conversation
      this.conversations.set(conversationId, {
        psid: conversationId,
        firstName: messageData.userProfile?.first_name || 'Usuário',
        lastName: messageData.userProfile?.last_name || '',
        profilePic: messageData.userProfile?.profile_pic || 'https://via.placeholder.com/48',
        lastMessage: messageData.message.text || 'Anexo',
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        unreadCount: messageData.direction === 'incoming' ? 1 : 0
      });
      
      console.log('💾 Message stored successfully');
      return messageRecord;
    } catch (error) {
      console.error('Error storing message:', error);
      throw error;
    }
  }

  // Notify frontend about events
  notifyFrontend(event, data) {
    // TODO: Implement WebSocket or Server-Sent Events to notify frontend
    console.log(`🔔 Frontend notification: ${event}`, data);
  }

  // Get conversations (implement your database logic here)
  async getConversations() {
    try {
      // Convert Map to Array for frontend consumption
      const conversationsList = Array.from(this.conversations.values());
      
      // Sort by timestamp (most recent first)
      conversationsList.sort((a, b) => {
        const timeA = new Date(`1970-01-01 ${a.timestamp}`).getTime();
        const timeB = new Date(`1970-01-01 ${b.timestamp}`).getTime();
        return timeB - timeA;
      });
      
      return conversationsList;
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  }

  // Get conversation history
  async getConversationHistory(psid, limit = 20, offset = 0) {
    try {
      const messages = this.messages.get(psid) || [];
      
      // Sort by timestamp (most recent first)
      const sortedMessages = messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      // Apply pagination
      const paginatedMessages = sortedMessages.slice(offset, offset + limit);
      
      return {
        messages: paginatedMessages,
        total: messages.length,
        hasMore: offset + limit < messages.length
      };
    } catch (error) {
      console.error('Error getting conversation history:', error);
      return { messages: [], total: 0, hasMore: false };
    }
  }

  // Send typing indicator
  async sendTypingIndicator(psid) {
    try {
      const requestBody = {
        recipient: { id: psid },
        sender_action: 'typing_on'
      };

      await axios.post(`${this.apiUrl}/messages`, requestBody, {
        params: { access_token: this.pageAccessToken }
      });

      console.log('✅ Typing indicator sent');
    } catch (error) {
      console.error('❌ Error sending typing indicator:', error);
    }
  }

  // Get page info
  async getPageInfo() {
    try {
      const response = await axios.get('https://graph.facebook.com/v18.0/me', {
        params: {
          fields: 'name,id,about,category,picture',
          access_token: this.pageAccessToken
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error getting page info:', error);
      throw error;
    }
  }
}

module.exports = new MessengerService();