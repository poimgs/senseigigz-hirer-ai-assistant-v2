import React, { useState, useRef } from 'react';
import FormSections from './components/FormSections';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatSidebar from './components/ChatSidebar';
import { GigDescription } from './types/gig';
import { SuggestionData, SuggestionsState } from './types/suggestion';
import { formSections } from './data/formSections';
import apiService from './services/apiService';
import { findTextDifferences } from './utils/textUtils';

function App() {
  const [showChat, setShowChat] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [gigDescription, setGigDescription] = useState<GigDescription>({
    title: '',
    summary: '',
    companyBackground: '',
    deliverables: '',
    skills: '',
    budget: '',
    timeline: '',
    communication: '',
    ownership: '',
    confidentiality: '',
    notes: '',
  });
  
  const [suggestionData, setSuggestionData] = useState<SuggestionsState>({});
  const [loading, setLoading] = useState(false);
  const [activeSuggestionSection, setActiveSuggestionSection] = useState<string | null>(null);
  
  const updateGigDescription = (section: keyof GigDescription, value: string) => {
    const newGigDescription = { ...gigDescription, [section]: value };
    setGigDescription(newGigDescription);
  };

  const generateSuggestion = async (section: keyof GigDescription, content: string) => {
    setLoading(true);
    
    try {
      // Call the server API to improve the specific section
      const data = await apiService.improveSection(section, content, gigDescription);
      
      // Parse the JSON response if it's a string
      let parsedData: SuggestionData | null = null;
      
      try {
        if (typeof data.text === 'string') {
          parsedData = JSON.parse(data.text);
        }
      } catch (e) {
        console.error('Error parsing JSON response:', e);
        return;
      }
      
      // Get the suggested text and explanation from the response
      const suggestedText = parsedData?.suggested_update || data.suggestion || '';
      const explanation = parsedData?.explanation || 'AI-generated suggestion for improving this section.';
      
      // Calculate differences between current text and suggested text
      const currentText = gigDescription[section];
      const differences = findTextDifferences(currentText, suggestedText);
      
      // Update the suggestions state with the new suggestion
      setSuggestionData(prev => ({
        ...prev,
        [section]: {
          suggestedUpdate: suggestedText,
          explanation: explanation,
          differences: differences
        }
      }));
      
      // Set the active suggestion section
      setActiveSuggestionSection(section);
    } catch (error) {
      console.error('Error generating suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSuggestion = (newContent: string) => {
    if (activeSuggestionSection) {
      // Update the content with the suggestion
      updateGigDescription(activeSuggestionSection as keyof GigDescription, newContent);
      
      // Clear the suggestion for this section
      setSuggestionData(prev => {
        const newState = { ...prev };
        delete newState[activeSuggestionSection];
        return newState;
      });
      
      // Clear the active suggestion section
      setActiveSuggestionSection(null);
    }
  };

  const handleDismissSuggestion = () => {
    if (activeSuggestionSection) {
      // Clear the suggestion for this section
      setSuggestionData(prev => {
        const newState = { ...prev };
        delete newState[activeSuggestionSection];
        return newState;
      });
    
      // Clear the active suggestion section
      setActiveSuggestionSection(null);
    }
  };

  // TODO: Implement file upload logic
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
    // TODO: Implement AI edit logic
    console.log("AI edit functionality not implemented yet");
    alert("AI edit functionality is not yet implemented. Coming soon!");
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
              expandedSections={expandedSections}
              setExpandedSections={setExpandedSections}
              sections={formSections}
              loading={loading}
              handleAcceptSuggestion={handleAcceptSuggestion}
              handleDismissSuggestion={handleDismissSuggestion}
              generateSuggestion={generateSuggestion}
              suggestions={suggestionData}
            />
          </div>
        </div>

        {/* Right sidebar - navigation and tools */}
        <Sidebar 
          showChat={showChat}
          setShowChat={setShowChat}
          fileInputRef={fileInputRef}
          handleFileUpload={handleFileUpload}
        />

        {/* Chat sidebar */}
        <ChatSidebar 
          showChat={showChat}
          setShowChat={setShowChat}
          gigDescription={gigDescription}
          updateGigDescription={updateGigDescription}
        />

      </main>
    </div>
  );
}

export default App;