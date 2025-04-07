import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FormSections from '../components/FormSections';
import Header from '../components/Header';
import { GigDescription } from '../types/gig';
import { SuggestionData, SuggestionsState } from '../types/suggestion';
import { formSections } from '../data/formSections';
import { Eye } from 'lucide-react';
import { useSuggestions } from '../hooks/useSuggestions';

interface LocationState {
  gigDescription?: GigDescription;
}

function GigBuilder() {
  const location = useLocation();
  const navigate = useNavigate();
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
  
  const {
    loading,
    suggestionData,
    hasActiveSuggestion,
    generateSuggestion: generateSuggestionBase,
    handleEnhanceSuggestion: handleEnhanceSuggestionBase,
    handleAcceptSuggestion: handleAcceptSuggestionBase,
    handleDismissSuggestion
  } = useSuggestions();

  useEffect(() => {
    const state = location.state as LocationState;
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

  const generateSuggestion = (section: keyof GigDescription, content: string) => {
    generateSuggestionBase(section, content, gigDescription);
  };

  const handleEnhanceSuggestion = (section: keyof GigDescription, content: string) => {
    handleEnhanceSuggestionBase(section, content, gigDescription);
  };

  const handleAcceptSuggestion = (newContent: string) => {
    handleAcceptSuggestionBase(newContent, updateGigDescription);
  };

  const toggleOptionalSection = (sectionId: string) => {
    setActiveSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          
          <button
            onClick={() => navigate('/content', { state: { gigDescription } })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-5 h-5" />
            View Content
          </button>
        </div>
        <FormSections
          gigDescription={gigDescription}
          updateGigDescription={updateGigDescription}
          expandedSections={expandedSections}
          setExpandedSections={setExpandedSections}
          activeSections={activeSections}
          sections={formSections}
          loading={loading}
          handleAcceptSuggestion={handleAcceptSuggestion}
          handleDismissSuggestion={handleDismissSuggestion}
          generateSuggestion={generateSuggestion}
          handleEnhanceSuggestion={handleEnhanceSuggestion}
          suggestions={suggestionData}
          toggleOptionalSection={toggleOptionalSection}
        />
      </div>
    </>
  );
}

export default GigBuilder;
