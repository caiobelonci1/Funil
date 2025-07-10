import React, { useState } from 'react';
import Sidebar from './Sidebar';
import KanbanBoard from './KanbanBoard';
import MessengerIntegration from './MessengerIntegration';
import { MessageSquare } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('painel');

  const renderContent = () => {
    switch (activeSection) {
      case 'painel':
        return <KanbanBoard />;
      case 'chats':
        return (
          <MessengerIntegration />
        );
      case 'contatos':
        return (
          <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-semibold text-gray-600 mb-2">Gerenciar Contatos</div>
              <p className="text-gray-500">Funcionalidade em desenvolvimento</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-semibold text-gray-600 mb-2">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </div>
              <p className="text-gray-500">Funcionalidade em desenvolvimento</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      {renderContent()}
    </div>
  );
};

export default Dashboard;