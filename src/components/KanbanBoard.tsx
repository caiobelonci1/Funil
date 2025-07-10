import React, { useState } from 'react';
import KanbanColumn from './KanbanColumn';
import { Contact } from './ContactCard';

const KanbanBoard: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Alberto',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      value: 140.00,
      lastMessage: 'Bom dia!',
      timestamp: '15/04',
      operator: 'operador 1',
      operatorId: 1,
      stage: 'conversas'
    },
    {
      id: '2',
      name: 'Yasmin',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      value: 79.90,
      lastMessage: 'Já efetuei o pagamento',
      timestamp: '15/04',
      operator: 'operador 3',
      operatorId: 3,
      stage: 'conversas'
    },
    {
      id: '3',
      name: 'Alice',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      value: 95.00,
      lastMessage: 'Qual o prazo?',
      timestamp: '15/04',
      operator: 'operador 3',
      operatorId: 3,
      stage: 'conversas'
    },
    {
      id: '4',
      name: 'Thiago',
      avatar: 'https://images.pexels.com/photos/2102415/pexels-photo-2102415.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      value: 110.00,
      lastMessage: 'Tenho interesse',
      timestamp: '15/04',
      operator: 'operador 6',
      operatorId: 6,
      stage: 'conversas'
    },
    {
      id: '5',
      name: 'Joaquim',
      avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      value: 200.00,
      lastMessage: 'Gostei bastante',
      timestamp: '15/04',
      operator: 'operador 2',
      operatorId: 2,
      stage: 'pendentes'
    },
    {
      id: '6',
      name: 'Lucas',
      avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      value: 130.00,
      lastMessage: 'Vou pensar',
      timestamp: '15/04',
      operator: 'operador 1',
      operatorId: 1,
      stage: 'pendentes'
    },
    {
      id: '7',
      name: 'Luciana',
      avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      value: 38.00,
      lastMessage: 'Quero testar sim',
      timestamp: '15/04',
      operator: 'operador 4',
      operatorId: 4,
      stage: 'pendentes'
    },
    {
      id: '8',
      name: 'Paulo Henrique',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      value: 150.00,
      lastMessage: 'Achei ótima',
      timestamp: '15/04',
      operator: 'operador 5',
      operatorId: 5,
      stage: 'concluidas'
    },
    {
      id: '9',
      name: 'Alfredo',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      value: 75.00,
      lastMessage: 'Deu tudo certo',
      timestamp: '18:48',
      operator: 'operador 5',
      operatorId: 5,
      stage: 'concluidas'
    },
    {
      id: '10',
      name: 'Tayla',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      value: 110.00,
      lastMessage: 'Consegui sim',
      timestamp: '15/04',
      operator: 'operador 1',
      operatorId: 1,
      stage: 'concluidas'
    },
    {
      id: '11',
      name: 'Bruno',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      value: 50.00,
      lastMessage: 'Tudo certo',
      timestamp: '08/04',
      operator: 'operador 3',
      operatorId: 3,
      stage: 'concluidas'
    }
  ]);

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
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;