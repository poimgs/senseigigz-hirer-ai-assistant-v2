import React from 'react';
import { X } from 'lucide-react';
import ChatInterface from './ChatInterface';
import { GigDescription } from '../types/gig';

interface ChatSidebarProps {
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  gigDescription: GigDescription;
  updateGigDescription: (section: keyof GigDescription, value: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  showChat,
  setShowChat,
  gigDescription,
  updateGigDescription,
}) => {
  return (
    <div 
      className={`fixed top-[64px] right-0 bottom-0 w-[40%] bg-white shadow-lg transform transition-transform duration-300 flex flex-col ${
        showChat ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
        <button 
          onClick={() => setShowChat(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>
      <ChatInterface 
        gigDescription={gigDescription}
        updateGigDescription={updateGigDescription}
      />
    </div>
  );
};

export default ChatSidebar;
