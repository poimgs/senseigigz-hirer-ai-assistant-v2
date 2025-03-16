import React, { useState } from 'react';
import Section from './Section';
import { GigDescription } from '../types/gig';
import { FormSection } from '../types/form';
import { requiredSections } from '../data/formSections';
import { SuggestionsState } from '../types/suggestion';

interface FormSectionsProps {
  gigDescription: GigDescription;
  updateGigDescription: (section: keyof GigDescription, value: string) => void;
  expandedSections: string[];
  setExpandedSections: React.Dispatch<React.SetStateAction<string[]>>;
  sections: FormSection[];
  loading: boolean;
  handleAcceptSuggestion: (newContent: string) => void;
  handleDismissSuggestion: () => void;
  generateSuggestion: (section: keyof GigDescription, content: string) => void;
  suggestions: SuggestionsState;
}

const FormSections: React.FC<FormSectionsProps> = ({ 
  gigDescription, 
  updateGigDescription,
  expandedSections,
  setExpandedSections,
  sections,
  loading,
  handleAcceptSuggestion,
  handleDismissSuggestion,
  generateSuggestion,
  suggestions,
}) => {
  const [activeSections, setActiveSections] = useState<string[]>(requiredSections.map(section => section.id));

  const toggleOptionalSection = (sectionId: string) => {
    setActiveSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Check if there's any active suggestion
  const hasActiveSuggestion = Object.values(suggestions).some(suggestion => suggestion !== null);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Your Gig Description</h2>
      <p className="text-gray-600 mb-6">Fill out each section to create a comprehensive gig description. Use the AI assistant for suggestions or click the chat icon for more help.</p>
      
      <div className="space-y-4">
        {sections.filter(section => activeSections.includes(section.id)).map((section) => (
          <Section
            key={section.id}
            section={section}
            gigDescription={gigDescription}
            updateGigDescription={updateGigDescription}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            toggleOptionalSection={toggleOptionalSection}
            suggestion={suggestions[section.id]}
            loading={loading}
            handleAcceptSuggestion={handleAcceptSuggestion}
            handleDismissSuggestion={handleDismissSuggestion}
            generateSuggestion={generateSuggestion}
            hasActiveSuggestion={hasActiveSuggestion}
          />
        ))}
      </div>
    </div>
  );
};

export default FormSections;