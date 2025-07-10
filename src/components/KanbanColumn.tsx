import React from 'react';
import { Search, MoreHorizontal } from 'lucide-react';
import ContactCard, { Contact } from './ContactCard';

interface KanbanColumnProps {
  title: string;
  contacts: Contact[];
  totalValue: number;
  onDrop: (e: React.DragEvent, stage: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, contact: Contact) => void;
  onContactClick?: (contact: Contact) => void;
  stage: string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  contacts,
  totalValue,
  onDrop,
  onDragOver,
  onDragStart,
  onContactClick,
  stage
}) => {
  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const getColumnColor = () => {
    switch (stage) {
      case 'conversas':
        return 'bg-emerald-600';
      case 'pendentes':
        return 'bg-gray-600';
      case 'andamento':
        return 'bg-blue-600';
      case 'concluidas':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="flex-1 min-w-80">
      {/* Column Header */}
      <div className={`${getColumnColor()} text-white p-4 rounded-t-lg`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <div className="flex items-center gap-2">
            <button className="text-white/80 hover:text-white transition-colors">
              <Search size={16} />
            </button>
            <button className="text-white/80 hover:text-white transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
        
        <div className="text-white/90 text-sm">
          {formatCurrency(totalValue)} - {contacts.length} cards
        </div>
      </div>

      {/* Column Content */}
      <div
        className="bg-gray-100 min-h-96 p-4 rounded-b-lg space-y-3"
        onDrop={(e) => onDrop(e, stage)}
        onDragOver={onDragOver}
      >
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onDragStart={onDragStart}
            onClick={onContactClick}
          />
        ))}
        
        {contacts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum contato nesta etapa
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;