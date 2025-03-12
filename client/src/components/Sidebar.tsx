import React, { RefObject } from 'react';
import { MessageSquare, Upload } from 'lucide-react';

interface SidebarProps {
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  fileInputRef: RefObject<HTMLInputElement>;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  showChat,
  setShowChat,
  fileInputRef,
  handleFileUpload,
}) => {
  return (
    <div className="fixed right-0 top-[64px] bottom-0 w-16 bg-white border-l border-gray-200 flex flex-col items-center py-4 space-y-2">
      <div className="flex flex-col items-center space-y-2">
        <button 
          onClick={() => setShowChat(!showChat)}
          className={`p-3 rounded-lg ${showChat ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          title="AI Assistant Chat"
        >
          <MessageSquare size={24} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".txt,.doc,.docx,.pdf"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-lg text-gray-500 hover:bg-gray-100"
          title="Upload Resume"
        >
          <Upload size={24} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
