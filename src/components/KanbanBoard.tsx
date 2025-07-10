import React, { useState, useEffect } from 'react';
import KanbanColumn from './KanbanColumn';
import { Contact } from './ContactCard';
import ContactMessengerChat from './ContactMessengerChat';

// Tipo para mensagem da API
interface Message {
  id: string;
  text: string;
  senderId: string;
  userId: string;
  createdAt: string;
}

// Tipo para contato da API
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

const KanbanBoard: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<APIContact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar contatos da API
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contacts');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar contatos');
      }
      
      const apiContacts: APIContact[] = await response.json();
      
      // Converter contatos da API para o formato do Kanban
      const kanbanContacts: Contact[] = apiContacts.map(contact => ({
        id: contact.id,
        name: contact.name || `${contact.firstName} ${contact.lastName}`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.firstName + ' ' + contact.lastName)}&background=random`,
        value: Math.floor(Math.random() * 200) + 50, // Valor placeholder
        lastMessage: contact.messages.length > 0 
          ? contact.messages[contact.messages.length - 1].text 
          : 'Sem mensagens',
        timestamp: contact.messages.length > 0 
          ? new Date(contact.messages[contact.messages.length - 1].createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
          : new Date(contact.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        operator: 'operador 1',
        operatorId: 1,
        stage: mapStatusToStage(contact.status)
      }));
      
      setContacts(kanbanContacts);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar contatos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Mapear status da API para estágios do Kanban
  const mapStatusToStage = (status: string): string => {
    switch (status) {
      case 'INTERESSADO':
        return 'conversas';
      case 'AGUARDANDO_PAGAMENTO':
        return 'pendentes';
      case 'PAGO':
        return 'andamento';
      case 'FINALIZADO':
        return 'concluidas';
      case 'PERDIDO':
        return 'conversas';
      default:
        return 'conversas';
    }
  };

  // Função para selecionar um contato e buscar seus dados completos
  const handleContactClick = async (contact: Contact) => {
    try {
      const response = await fetch(`/api/contacts`);
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do contato');
      }
      
      const allContacts: APIContact[] = await response.json();
      const fullContact = allContacts.find(c => c.id === contact.id);
      
      if (fullContact) {
        setSelectedContact(fullContact);
      }
    } catch (err) {
      console.error('Erro ao buscar dados completos do contato:', err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const [draggedContact, setDraggedContact] = useState<Contact | null>(null);

  const handleDragStart = (e: React.DragEvent, contact: Contact) => {
    setDraggedContact(contact);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStage: string) => {
    e.preventDefault();
    
    if (draggedContact && draggedContact.stage !== newStage) {
      setContacts(prev => 
        prev.map(contact => 
          contact.id === draggedContact.id 
            ? { ...contact, stage: newStage }
            : contact
        )
      );
    }
    
    setDraggedContact(null);
  };

  const getContactsByStage = (stage: string) => {
    return contacts.filter(contact => contact.stage === stage);
  };

  const getTotalValueByStage = (stage: string) => {
    return contacts
      .filter(contact => contact.stage === stage)
      .reduce((total, contact) => total + contact.value, 0);
  };

  const stages = [
    { id: 'conversas', title: 'Conversas' },
    { id: 'pendentes', title: 'Pendentes' },
    { id: 'andamento', title: 'Andamento' },
    { id: 'concluidas', title: 'Concluídas' }
  ];

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-600 mb-2">Carregando contatos...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar contatos</div>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={fetchContacts}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-x-auto">
      <div className="flex gap-6 min-w-max">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            title={stage.title}
            stage={stage.id}
            contacts={getContactsByStage(stage.id)}
            totalValue={getTotalValueByStage(stage.id)}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            onContactClick={handleContactClick}
          />
        ))}
      </div>

      {/* Modal de conversa */}
      {selectedContact && (
        <ContactMessengerChat
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onMessageSent={() => {
            // Recarregar contatos após envio de mensagem
            fetchContacts();
          }}
        />
      )}
    </div>
  );
};

export default KanbanBoard;