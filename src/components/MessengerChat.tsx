import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { messengerAPI, MessengerMessage, MessengerContact } from '../services/messengerApi';

interface MessengerChatProps {
  contact: MessengerContact;
  onClose: () => void;
}

const MessengerChat: React.FC<MessengerChatProps> = ({ contact, onClose }) => {
  const [messages, setMessages] = useState<MessengerMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setIsLoading(true);

    // Add message to UI immediately
    const tempMessage: MessengerMessage = {
      id: Date.now().toString(),
      text: messageText,
      timestamp: new Date().toISOString(),
      direction: 'outgoing',
      psid: contact.psid
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
      await messengerAPI.sendMessage(contact.psid, messageText);
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove the message from UI if it failed
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sendQuickReply = async (text: string, replies: Array<{title: string, payload: string}>) => {
    try {
      await messengerAPI.sendQuickReply(contact.psid, text, replies);
    } catch (error) {
      console.error('Failed to send quick reply:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <img
            src={contact.profilePic}
            alt={contact.firstName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-800">
              {contact.firstName} {contact.lastName}
            </h3>
            <p className="text-sm text-green-600">Online no Messenger</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors">
            <Phone size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors">
            <Video size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors">
            <MoreVertical size={20} />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              Inicie uma conversa com {contact.firstName}
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => sendQuickReply('Olá! Como posso ajudá-lo hoje?', [
                  { title: 'Produtos', payload: 'PRODUCTS' },
                  { title: 'Preços', payload: 'PRICING' },
                  { title: 'Suporte', payload: 'SUPPORT' }
                ])}
                className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
              >
                Enviar Saudação
              </button>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.direction === 'outgoing' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.direction === 'outgoing'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.direction === 'outgoing' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => sendQuickReply('Gostaria de saber mais sobre nossos produtos?', [
              { title: 'Sim', payload: 'YES_PRODUCTS' },
              { title: 'Não', payload: 'NO_PRODUCTS' }
            ])}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            Produtos
          </button>
          <button
            onClick={() => sendQuickReply('Precisa de ajuda com alguma coisa?', [
              { title: 'Suporte Técnico', payload: 'TECH_SUPPORT' },
              { title: 'Vendas', payload: 'SALES' },
              { title: 'Outros', payload: 'OTHER' }
            ])}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            Ajuda
          </button>
          <button
            onClick={() => messengerAPI.sendMessage(contact.psid, 'Obrigado pelo contato! Em breve retornaremos.')}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            Agradecimento
          </button>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
            <Paperclip size={20} />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
            <Smile size={20} />
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessengerChat;