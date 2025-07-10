const API_BASE_URL = 'http://localhost:3001/api/messenger';

export interface MessengerContact {
  psid: string;
  firstName: string;
  lastName: string;
  profilePic: string;
  lastMessage?: string;
  timestamp?: string;
}

export interface MessengerMessage {
  id: string;
  text: string;
  timestamp: string;
  direction: 'incoming' | 'outgoing';
  psid: string;
}

class MessengerAPI {
  // Send message to user
  async sendMessage(recipientId: string, message: string | object, messageType: string = 'text') {
    try {
      const response = await fetch(`${API_BASE_URL}/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId,
          message,
          messageType
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get user profile
  async getUserProfile(psid: string): Promise<MessengerContact> {
    try {
      const response = await fetch(`${API_BASE_URL}/user-profile/${psid}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        psid,
        firstName: data.profile.first_name,
        lastName: data.profile.last_name,
        profilePic: data.profile.profile_pic
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Get conversations
  async getConversations(): Promise<MessengerContact[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/conversations`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.conversations;
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw error;
    }
  }

  // Mark conversation as read
  async markAsRead(psid: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ psid })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking as read:', error);
      throw error;
    }
  }

  // Send quick reply message
  async sendQuickReply(recipientId: string, text: string, quickReplies: Array<{title: string, payload: string}>) {
    const message = {
      text,
      quick_replies: quickReplies.map(reply => ({
        content_type: 'text',
        title: reply.title,
        payload: reply.payload
      }))
    };

    return this.sendMessage(recipientId, message, 'quick_reply');
  }

  // Send template message
  async sendTemplate(recipientId: string, templatePayload: any) {
    const message = {
      payload: templatePayload
    };

    return this.sendMessage(recipientId, message, 'template');
  }

  // Get conversation history
  async getConversationHistory(psid: string, limit: number = 20, offset: number = 0) {
    try {
      const response = await fetch(`${API_BASE_URL}/conversation/${psid}?limit=${limit}&offset=${offset}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting conversation history:', error);
      throw error;
    }
  }

  // Check server health
  async checkHealth() {
    try {
      const response = await fetch('http://localhost:3001/health');
      return response.ok;
    } catch (error) {
      console.error('Error checking server health:', error);
      return false;
    }
  }

  // Send button template
  async sendButtonTemplate(recipientId: string, text: string, buttons: Array<{title: string, payload: string, type?: string}>) {
    try {
      const response = await fetch(`${API_BASE_URL}/send-button-template`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId,
          text,
          buttons
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending button template:', error);
      throw error;
    }
  }
}

export const messengerAPI = new MessengerAPI();