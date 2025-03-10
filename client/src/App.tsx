import React, { useState, useRef } from 'react';
import { MessageSquare, FileText, Send, Edit3, Check, X, Download, Copy, Share2, Upload } from 'lucide-react';
import FormSections from './components/FormSections';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import { sections } from './components/FormSections';

type TabType = 'form' | 'chat' | 'preview';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('form');
  const [showChat, setShowChat] = useState(false);
  const [showAIChanges, setShowAIChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [gigDescription, setGigDescription] = useState({
    title: '',
    summary: '',
    companyBackground: '',
    deliverables: '',
    responsibilities: '',
    successCriteria: '',
    skills: '',
    budget: '',
    timeline: '',
    communication: '',
    ownership: '',
    confidentiality: '',
    notes: '',
  });
  
  const [history, setHistory] = useState<Array<typeof gigDescription>>([]);
  
  const updateGigDescription = (section: keyof typeof gigDescription, value: string) => {
    const newGigDescription = { ...gigDescription, [section]: value };
    setGigDescription(newGigDescription);
    
    // Add to history every few changes (simplified version control)
    if (Math.random() > 0.7) { // Only add to history occasionally to avoid too many versions
      setHistory([...history, gigDescription]);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        // Simple parsing logic - in real app would use more sophisticated parsing
        if (text.toLowerCase().includes('skills') || text.toLowerCase().includes('experience')) {
          updateGigDescription('skills', text);
        }
        if (text.toLowerCase().includes('summary') || text.toLowerCase().includes('about')) {
          updateGigDescription('summary', text);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleAIEdit = () => {
    setShowAIChanges(true);
    setExpandedSections(sections.map(s => s.id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <Header onAIEdit={handleAIEdit} />
      
      <main className="flex-grow flex relative">
        {/* Main content area */}
        <div className="flex-grow p-4 md:p-6 overflow-y-auto">
          <div className={`transition-all duration-300 ${showChat ? 'mr-[40%]' : ''}`}>
            <FormSections 
              gigDescription={gigDescription} 
              updateGigDescription={updateGigDescription}
              showAIChanges={showAIChanges}
              expandedSections={expandedSections}
              setExpandedSections={setExpandedSections}
            />
          </div>
        </div>

        {/* Right sidebar - navigation and tools */}
        <div className="fixed right-0 top-[64px] bottom-0 w-16 bg-white border-l border-gray-200 flex flex-col items-center py-4 space-y-2">
          <div className="flex flex-col items-center space-y-2">
            <button 
              onClick={() => {
                setShowChat(!showChat);
              }}
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

          {/* Chat sidebar */}
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

      </main>
    </div>
  );
}

export default App;