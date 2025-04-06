import React from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, X } from 'lucide-react';
import { GigDescription } from '../types/gig';
import { FormSection } from '../types/form';
import { isRequiredSection } from '../utils/formUtils';
import AIAssistant from './AIAssistant';
import { SectionSuggestion } from '../types/suggestion';

interface SectionProps {
  section: FormSection;
  gigDescription: GigDescription;
  updateGigDescription: (section: keyof GigDescription, value: string) => void;
  expandedSections: string[];
  setExpandedSections: (sectionIds: string[]) => void;
  toggleOptionalSection: (sectionId: string) => void;
  suggestion: SectionSuggestion | null;
  loading: boolean;
  handleAcceptSuggestion: (newContent: string) => void;
  handleDismissSuggestion: () => void;
  generateSuggestion: (section: keyof GigDescription, content: string) => void;
  handleEnhanceSuggestion: (section: keyof GigDescription, content: string) => void;
  hasActiveSuggestion: boolean;
  onClose?: () => void;
}

const Section: React.FC<SectionProps> = ({
  section,
  gigDescription,
  updateGigDescription,
  expandedSections,
  setExpandedSections,
  toggleOptionalSection,
  suggestion,
  loading,
  handleAcceptSuggestion,
  handleDismissSuggestion,
  generateSuggestion,
  handleEnhanceSuggestion,
  hasActiveSuggestion,
  onClose
}) => {
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <div
      key={section.id}
      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${
        expandedSections.includes(section.id) ? 'mb-4' : 'border-b-0'
      }`}
      data-section={section.id}
    >
      <div className="relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2 flex-grow">
            <button
              onClick={() => toggleSection(section.id)}
              className="flex items-center text-lg font-medium text-gray-800 hover:text-gray-600"
            >
              {section.title}
              {expandedSections.includes(section.id) ? (
                <ChevronUp size={20} className="ml-2" />
              ) : (
                <ChevronDown size={20} className="ml-2" />
              )}
              {!expandedSections.includes(section.id) && (
                <span className="ml-3 text-sm text-gray-500 truncate">
                  {gigDescription[section.id as keyof typeof gigDescription] ? (
                    <>
                      {gigDescription[section.id as keyof typeof gigDescription].slice(0, 50)}
                      {gigDescription[section.id as keyof typeof gigDescription].length > 50 ? '...' : ''}
                    </>
                  ) : (
                    <span className="italic text-gray-400">Empty</span>
                  )}
                </span>
              )}
            </button>
            <button
              className="group relative ml-1"
              title={section.description}
            >
              <HelpCircle className="w-4 h-4 text-gray-400" />
              <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-sm text-left rounded shadow-lg">
                {section.description}
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <span className="font-semibold">Example:</span>
                  <p className="text-gray-300 text-xs mt-1">{section.example}</p>
                </div>
                {'additionalInfo' in section && section.additionalInfo && (
                  <>
                    {Object.entries(section.additionalInfo).map(([key, info]) => (
                      <div key={key} className="mt-3 pt-3 border-t border-gray-700">
                        <span className="font-semibold">{info.title}</span>
                        <p className="text-gray-300 text-xs mt-1">{info.description}</p>
                        <p className="text-gray-300 text-xs mt-1">{info.example}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </button>
          </div>
          <div className={`flex items-center gap-2 ${onClose ? 'mr-8' : ''}`}>
            {!isRequiredSection(section) && (
              <button
                onClick={() => toggleOptionalSection(section.id)}
                className="group relative p-1.5 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <X size={16} />
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 whitespace-nowrap text-sm bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  Remove section
                </span>
              </button>
            )}
            <button
              onClick={() => generateSuggestion(section.id, gigDescription[section.id])}
              className={`group relative p-1.5 rounded-full ${
                hasActiveSuggestion
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-400 hover:bg-blue-50 hover:text-blue-600'
              } transition-colors`}
              disabled={hasActiveSuggestion}
            >
              <Sparkles size={16} />
              <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 whitespace-nowrap text-sm bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {hasActiveSuggestion ? 'Please resolve the current suggestion first' : 'Suggest'}
              </span>
            </button>
          </div>
        </div>

        {expandedSections.includes(section.id) && (
          <>
            <div className="relative">
              <textarea
                id={section.id}
                value={gigDescription[section.id as keyof typeof gigDescription]}
                onChange={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                  updateGigDescription(section.id, e.target.value);
                }}
                placeholder={section.placeholder}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y overflow-hidden ${
                  suggestion ? 'bg-gray-100 text-gray-500' : ''
                }`}
                disabled={!!suggestion}
              />
            </div>
            
            {(loading || suggestion) && (
              <div className="mt-4">
                <AIAssistant
                  suggestion={suggestion}
                  loading={loading}
                  handleAcceptSuggestion={handleAcceptSuggestion}
                  handleDismissSuggestion={handleDismissSuggestion}
                  handleEnhanceSuggestion={
                    suggestion 
                      ? (newContent: string) => handleEnhanceSuggestion(section.id, newContent)
                      : undefined
                  }
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Section;
