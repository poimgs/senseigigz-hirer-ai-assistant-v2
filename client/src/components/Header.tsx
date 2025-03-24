import React from 'react';
import { Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <Briefcase className="text-blue-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-800">Gig Description Builder</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;