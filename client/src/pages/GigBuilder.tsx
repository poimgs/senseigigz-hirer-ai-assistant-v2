import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FormSections from '../components/FormSections';
import Header from '../components/Header';
import { GigDescription } from '../types/gig';
import { SuggestionData, SuggestionsState } from '../types/suggestion';
import { formSections } from '../data/formSections';
import apiService from '../services/apiService';
import { findTextDifferences } from '../utils/textUtils';

interface LocationState {
  gigDescription?: GigDescription;
}

function GigBuilder() {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [activeSections, setActiveSections] = useState<string[]>([]);
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
  
  useEffect(() => {
    const state = location.state as LocationState;
    console.log(state);
    if (state?.gigDescription) {
      setGigDescription(state.gigDescription);
      // Expand all sections that have content and activate them if they are optional
      const sectionsWithContent = Object.entries(state.gigDescription)
        .filter(([_, value]) => typeof value === 'string' && value.trim() !== '')
        .map(([key]) => key);
      setExpandedSections(sectionsWithContent);
      setActiveSections([
        ...formSections.filter(section => section.required).map(section => section.id),
        ...sectionsWithContent.filter(sectionId => 
          formSections.some(section => section.id === sectionId && !section.required)
        )
      ]);
    } else {
      // Initialize with required sections
      setActiveSections(formSections.filter(section => section.required).map(section => section.id));
    }
  }, [location.state]);

  const updateGigDescription = (section: keyof GigDescription, value: string) => {
    const newGigDescription = { ...gigDescription, [section]: value };
    setGigDescription(newGigDescription);
  };

  const generateSuggestion = async (section: keyof GigDescription, content: string) => {
    setLoading(true);
    
    try {
      const data = await apiService.improveSection(section, content, gigDescription);
      let parsedData: SuggestionData | null = null;
      
      try {
        if (typeof data.text === 'string') {
          parsedData = JSON.parse(data.text);
        }
      } catch (e) {
        console.error('Error parsing JSON response:', e);
        return;
      }
      
      const suggestedText = parsedData?.suggested_update || data.suggestion || '';
      const explanation = parsedData?.explanation || 'AI-generated suggestion for improving this section.';
      const currentText = gigDescription[section];
      const differences = findTextDifferences(currentText, suggestedText);
      
      setSuggestionData(prev => ({
        ...prev,
        [section]: {
          suggestedUpdate: suggestedText,
          explanation: explanation,
          differences: differences
        }
      }));
      
      setActiveSuggestionSection(section);
    } catch (error) {
      console.error('Error generating suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSuggestion = (newContent: string) => {
    if (activeSuggestionSection) {
      updateGigDescription(activeSuggestionSection as keyof GigDescription, newContent);
      setSuggestionData(prev => {
        const newState = { ...prev };
        delete newState[activeSuggestionSection];
        return newState;
      });
      setActiveSuggestionSection(null);
    }
  };

  const handleDismissSuggestion = () => {
    if (activeSuggestionSection) {
      setSuggestionData(prev => {
        const newState = { ...prev };
        delete newState[activeSuggestionSection];
        return newState;
      });
      setActiveSuggestionSection(null);
    }
  };

  const toggleOptionalSection = (sectionId: string) => {
    setActiveSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <Header />
      
      <main className="flex-grow flex relative">
        <div className="flex-grow p-4 md:p-6 overflow-y-auto">
          <div className={"transition-all duration-300"}>
            <FormSections 
              gigDescription={gigDescription} 
              updateGigDescription={updateGigDescription}
              expandedSections={expandedSections}
              setExpandedSections={setExpandedSections}
              activeSections={activeSections}
              setActiveSections={setActiveSections}
              sections={formSections}
              loading={loading}
              handleAcceptSuggestion={handleAcceptSuggestion}
              handleDismissSuggestion={handleDismissSuggestion}
              generateSuggestion={generateSuggestion}
              suggestions={suggestionData}
              toggleOptionalSection={toggleOptionalSection}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default GigBuilder;
