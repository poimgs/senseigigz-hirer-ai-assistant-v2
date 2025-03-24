import React from 'react';
import Section from './Section';
import { GigDescription } from '../types/gig';
import { FormSection } from '../types/form';
import { SuggestionsState } from '../types/suggestion';
import { Plus, X } from 'lucide-react';

interface FormSectionsProps {
  gigDescription: GigDescription;
  updateGigDescription: (section: keyof GigDescription, value: string) => void;
  expandedSections: string[];
  setExpandedSections: (sections: string[]) => void;
  activeSections: string[];
  sections: FormSection[];
  toggleOptionalSection: (sectionId: string) => void;
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
  activeSections,
  sections,
  toggleOptionalSection,
  loading,
  handleAcceptSuggestion,
  handleDismissSuggestion,
  generateSuggestion,
  suggestions,
}) => {
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
            setExpandedSections={setExpandedSections}
            toggleOptionalSection={toggleOptionalSection}
            suggestion={suggestions[section.id]}
            loading={loading}
            handleAcceptSuggestion={handleAcceptSuggestion}
            handleDismissSuggestion={handleDismissSuggestion}
            generateSuggestion={generateSuggestion}
            hasActiveSuggestion={hasActiveSuggestion}
          />
        ))}

        {/* Optional sections */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Optional Sections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.filter(section => !section.required).map((section) => (
              <button
                key={section.id}
                onClick={() => toggleOptionalSection(section.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  activeSections.includes(section.id)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-grow text-left">
                    <h4 className="font-medium mb-1">{section.title}</h4>
                    <p className="text-sm text-gray-500">{section.description}</p>
                  </div>
                  <div className="ml-4">
                    {expandedSections.includes(section.id) ? (
                      <X size={20} className="text-blue-500" />
                    ) : (
                      <Plus size={20} className="text-gray-400" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSections;