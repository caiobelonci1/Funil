import React from 'react';
import { 
  BarChart3, 
  MessageSquare, 
  Filter, 
  Users, 
  Zap, 
  Calendar, 
  Send, 
  BookOpen,
  User
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'painel', label: 'Painel', icon: BarChart3 },
    { id: 'chats', label: 'Chats', icon: MessageSquare },
    { id: 'funil', label: 'Funil', icon: Filter },
    { id: 'contatos', label: 'Contatos', icon: Users },
    { id: 'automacao', label: 'Automação', icon: Zap },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'disparos', label: 'Disparos', icon: Send },
    { id: 'recursos', label: 'Recursos', icon: BookOpen },
  ];

  return (
    <div className="w-20 bg-gray-800 h-screen flex flex-col items-center py-6 space-y-6">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        
        return (
          <div key={item.id} className="relative group">
            <button
              onClick={() => onSectionChange(item.id)}
              className={`p-3 rounded-lg transition-all duration-200 hover:bg-gray-700 relative ${
                isActive ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={24} />
              {isActive && (
                <div className="absolute inset-0 bg-emerald-600 rounded-lg animate-pulse opacity-30" />
              )}
            </button>
            
            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              {item.label}
            </div>
          </div>
        );
      })}
      
      {/* User Profile */}
      <div className="mt-auto">
        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
          <User size={20} className="text-gray-300" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;