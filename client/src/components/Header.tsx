import React from 'react';
import { Briefcase, Sparkles } from 'lucide-react';

interface HeaderProps {
  onAIEdit: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAIEdit }) => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Briefcase className="text-blue-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-800">Gig Description Builder</h1>
        </div>
        <div>
          <button
            onClick={onAIEdit}
            className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-4 rounded-lg transition-colors"
          >
            <Sparkles size={16} />
            <span>AI Edit</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;