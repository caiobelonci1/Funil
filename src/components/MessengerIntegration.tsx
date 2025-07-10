import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Settings, Zap } from 'lucide-react';
import MessengerChat from './MessengerChat';
import { messengerAPI, MessengerContact } from '../services/messengerApi';

const MessengerIntegration: React.FC = () => {
  const [contacts, setContacts] = useState<MessengerContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<MessengerContact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  useEffect(() => {
    loadContacts();
    checkConnectionStatus();
  }, []);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const conversations = await messengerAPI.getConversations();
      setContacts(conversations);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkConnectionStatus = async () => {
    try {
      setConnectionStatus('connecting');
      const isHealthy = await messengerAPI.checkHealth();
      setConnectionStatus(isHealthy ? 'connected' : 'disconnected');
    } catch (error) {
      console.error('Failed to check connection status:', error);
      setConnectionStatus('disconnected');
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600';
      case 'connecting':
        return 'text-yellow-600';
      default:
        return 'text-red-600';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Conectado ao Messenger';
      case 'connecting':
        return 'Conectando...';
      default:
        return 'Desconectado';
    }
  };

  if (selectedContact) {
    return (
      <div className="flex-1 h-screen">
        <MessengerChat
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Integração Facebook Messenger
            </h1>
            <p className="text-gray-600">
              Gerencie conversas do Facebook Messenger diretamente no CRM
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${getStatusColor()}`}>
              <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
              <span className="text-sm font-medium">{getStatusText()}</span>
            </div>
            
            <button
              onClick={checkConnectionStatus}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Settings size={16} className="inline mr-2" />
              Verificar Conexão
            </button>
          </div>
        </div>
      </div>

      {/* Connection Status Card */}
      {connectionStatus === 'disconnected' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="text-red-600" size={24} />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Configuração Necessária
              </h3>
              <p className="text-red-700 mb-4">
                Para usar a integração com Facebook Messenger, você precisa configurar:
              </p>
              
              <div className="space-y-2 text-sm text-red-700">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                  <span>Token de Acesso da Página do Facebook</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                  <span>Token de Verificação do Webhook</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                  <span>App Secret do Facebook</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                  <span>Configuração do Webhook no Facebook</span>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-red-100 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Passos para Configuração:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-red-700">
                  <li>Crie um app no Facebook Developers</li>
                  <li>Configure o produto Messenger</li>
                  <li>Gere um token de acesso da página</li>
                  <li>Configure o webhook apontando para: <code className="bg-red-200 px-1 rounded">http://localhost:3001/webhook</code></li>
                  <li>Adicione as variáveis de ambiente no arquivo .env</li>
                  <li>Inicie o servidor: <code className="bg-red-200 px-1 rounded">cd server && npm start</code></li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{contacts.length}</h3>
              <p className="text-gray-600">Conversas Ativas</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">0</h3>
              <p className="text-gray-600">Novos Contatos Hoje</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Zap className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">0</h3>
              <p className="text-gray-600">Mensagens Automáticas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Conversas Recentes</h2>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">Carregando conversas...</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Nenhuma conversa encontrada
              </h3>
              <p className="text-gray-500">
                {connectionStatus === 'connected' 
                  ? 'Aguardando novas mensagens do Messenger...'
                  : 'Configure a integração para ver as conversas aqui.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div
                  key={contact.psid}
                  onClick={() => setSelectedContact(contact)}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <img
                    src={contact.profilePic}
                    alt={contact.firstName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {contact.firstName} {contact.lastName}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {contact.lastMessage || 'Clique para iniciar conversa'}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {contact.timestamp || 'Agora'}
                    </p>
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto mt-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessengerIntegration;