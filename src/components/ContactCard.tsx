import React from 'react';
import { MoreVertical, Tag, Clock } from 'lucide-react';

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  value: number;
  lastMessage: string;
  timestamp: string;
  operator: string;
  operatorId: number;
  stage: string;
}

interface ContactCardProps {
  contact: Contact;
  onDragStart: (e: React.DragEvent, contact: Contact) => void;
  onClick?: (contact: Contact) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onDragStart, onClick }) => {
  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const getOperatorColor = (operatorId: number) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500', 
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500'
    ];
    return colors[operatorId % colors.length];
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, contact)}
      onClick={() => onClick?.(contact)}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow duration-200"
    >
      {/* Header with value and menu */}
      <div className="flex justify-between items-start mb-3">
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-800">
            {formatCurrency(contact.value)}
          </div>
          <div className="text-xs text-gray-500">{contact.timestamp}</div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Contact info */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={contact.avatar}
          alt={contact.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="font-medium text-gray-800">{contact.name}</div>
          <div className="text-sm text-gray-600 truncate">{contact.lastMessage}</div>
        </div>
      </div>

      {/* Footer with operator and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${getOperatorColor(contact.operatorId)}`} />
          <span className="text-xs text-gray-500">{contact.operator}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Tag size={14} />
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Clock size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;