import React, { useState } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  senderId: string;
  userId: string;
  createdAt: string;
}

interface APIContact {
  id: string;
  messengerId: string;
  firstName: string;
  lastName: string;
  name: string;
  status: string;
  adTitle?: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

interface ContactMessengerChatProps {
  contact: APIContact;
  onClose: () => void;
  onMessageSent?: () => void; // Callback para atualizar a lista de contatos
}

const ContactMessengerChat: React.FC<ContactMessengerChatProps> = ({ contact, onClose, onMessageSent }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>(contact.messages);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setIsLoading(true);

    // Adicionar mensagem otimisticamente à lista local
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      text: messageText,
      senderId: 'MEU_ID_DA_PAGINA',
      userId: contact.id,
      createdAt: new Date().toISOString(),
    };

    setLocalMessages(prev => [...prev, optimisticMessage]);

    try {
      const response = await fetch(`/api/contacts/${contact.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar mensagem');
      }

      console.log('Mensagem enviada:', result);
      
      // Chamar callback se disponível para atualizar a lista de contatos
      onMessageSent?.();

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      // Remover mensagem otimística em caso de erro
      setLocalMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      
      alert(`Erro ao enviar mensagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
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

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isMyMessage = (senderId: string) => {
    return senderId === 'MEU_ID_DA_PAGINA';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">
                {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold">{contact.firstName} {contact.lastName}</h3>
              <div className="text-xs text-blue-100">
                Status: {contact.status} {contact.adTitle && `• ${contact.adTitle}`}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {localMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageCircle size={48} className="mb-2" />
              <p>Nenhuma mensagem ainda</p>
              <p className="text-sm">Inicie uma conversa!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {localMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${isMyMessage(message.senderId) ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isMyMessage(message.senderId)
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-gray-200'
                    } ${message.id.startsWith('temp-') ? 'opacity-75' : ''}`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isMyMessage(message.senderId)
                          ? 'text-blue-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {formatMessageTime(message.createdAt)}
                      {message.id.startsWith('temp-') && (
                        <span className="ml-1">⏳</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isLoading}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMessengerChat;
