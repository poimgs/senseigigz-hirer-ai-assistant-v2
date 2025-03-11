import React, { useState, useEffect } from 'react';
import { Info, HelpCircle, ChevronDown, ChevronUp, Plus, Sparkles, X, Check } from 'lucide-react';
import AIAssistant from './AIAssistant';

interface FormSectionsProps {
  gigDescription: {
    title: string;
    summary: string;
    companyBackground: string;
    deliverables: string;
    responsibilities: string;
    successCriteria: string;
    skills: string;
    budget: string;
    timeline: string;
    communication: string;
    ownership: string;
    confidentiality: string;
    notes: string;
  };
  updateGigDescription: (section: string, value: string) => void;
  showAIChanges?: boolean;
  expandedSections: string[];
  setExpandedSections: (sections: string[]) => void;
}

export const sections = [
  {
    id: 'title',
    title: 'Gig Title',
    placeholder: 'E.g., Senior Mobile App Developer for Fitness Startup',
    description: 'Create a clear, specific title that attracts qualified freelancers',
    example: 'WordPress Website Developer for Local Restaurant',
  },
  {
    id: 'summary',
    title: 'Project Summary',
    placeholder: 'Brief overview of the project...',
    description: 'A concise overview of what you need and the project\'s purpose',
    example: 'We need an experienced developer to create a modern, mobile-responsive WordPress website for our family-owned restaurant.',
    textArea: true,
  },
  {
    id: 'companyBackground',
    title: 'Company Background',
    placeholder: 'Brief information about your company...',
    description: 'Provide context about your company and its industry',
    example: 'Our restaurant has been serving authentic Italian cuisine in downtown Portland for over 15 years. We have a loyal customer base but need to modernize our online presence.',
    textArea: true,
  },
  {
    id: 'deliverables',
    title: 'Deliverables',
    placeholder: 'Specific outputs expected from this project...',
    description: 'Define the project scope including deliverables, responsibilities, and success criteria',
    example: '• A fully functional WordPress website with 5-7 pages\n• Mobile-responsive design\n• Integration with our reservation system\n• SEO optimization for local search',
    textArea: true,
    additionalInfo: {
      responsibilities: {
        title: 'Key Responsibilities',
        description: 'Main tasks the freelancer will handle:',
        example: '• Design website layout and structure based on brand guidelines\n• Implement and customize WordPress theme\n• Set up necessary plugins\n• Provide basic staff training'
      },
      successCriteria: {
        title: 'Success Criteria',
        description: 'How success will be measured:',
        example: '• Website loads in under 3 seconds\n• Passes Google PageSpeed tests\n• Staff can update content independently\n• Reservation system works correctly'
      }
    }
  },
  {
    id: 'skills',
    title: 'Required Skills and Qualifications',
    placeholder: 'Skills and experience needed...',
    description: 'List both technical skills and relevant experience required',
    example: '• 3+ years of WordPress development experience\n• Proficiency with PHP, HTML, CSS, and JavaScript\n• Experience with restaurant or hospitality websites\n• Knowledge of SEO best practices\n• Portfolio showing similar projects',
    textArea: true,
  },
  {
    id: 'budget',
    title: 'Budget and Payment Terms',
    placeholder: 'Budget range and payment structure...',
    description: 'Clearly state your budget range and how/when you\'ll make payments',
    example: '• Budget range: $2,000-$3,000\n• Payment structure: 30% upfront, 30% at midpoint approval, 40% upon completion\n• Payment made via PayPal or bank transfer within 7 days of invoicing',
    textArea: true,
  },
  {
    id: 'timeline',
    title: 'Timeline and Milestones',
    placeholder: 'Project timeline, key milestones and deadlines...',
    description: 'Outline the project schedule and key milestones',
    example: '• Project start: June 1, 2025\n• Initial design concepts: June 15\n• Development completion: July 15\n• Testing and revisions: July 15-30\n• Final delivery: August 1',
    textArea: true,
  },
  {
    id: 'communication',
    title: 'Communication and Collaboration',
    placeholder: 'How will you communicate with the freelancer?',
    description: 'Specify your preferred communication methods and expectations',
    example: '• Weekly progress meetings via Zoom\n• Day-to-day communication through Slack\n• Shared Trello board for task tracking\n• Expectation of same-day responses during business hours',
    textArea: true,
  },
  {
    id: 'ownership',
    title: 'Ownership and Intellectual Property',
    placeholder: 'Who will own the work product and any IP?',
    description: 'Clearly define who will own the finished work and intellectual property',
    example: '• All final deliverables and code will be the exclusive property of [Company Name]\n• Freelancer will transfer all rights upon final payment\n• Freelancer may include the project in their portfolio with approval',
    textArea: true,
  },
  {
    id: 'confidentiality',
    title: 'Confidentiality and NDA Requirements (Optional)',
    placeholder: 'Any confidentiality requirements...',
    description: 'Specify if an NDA is required and any confidentiality concerns',
    example: '• Standard NDA will be required before project commencement\n• Access to internal systems will require confidentiality agreement\n• All customer data must be handled according to our privacy policy',
    textArea: true,
  },
  {
    id: 'notes',
    title: 'Additional Notes',
    placeholder: 'Any other important information...',
    description: 'Include any other relevant information not covered above',
    example: '• We have some existing brand assets available for use\n• We are open to suggestions on improving our online ordering process\n• Previous experience with Square POS integration is a plus',
    textArea: true,
  },
];

// Function to split text into words while preserving whitespace and punctuation
const splitIntoWords = (text: string): string[] => {
  // This regex captures words, whitespace, and punctuation as separate tokens
  return text.match(/\S+|\s+|[,.!?;:()\[\]{}"']/g) || [];
};

// Interface for diff result
interface DiffResult {
  type: 'addition' | 'deletion' | 'unchanged';
  text: string;
  startPos?: number;
  endPos?: number;
}

// More sophisticated diff algorithm using hierarchical approach
const findTextDifferences = (original: string, suggested: string): DiffResult[] => {
  if (!original || !suggested) return [];
  
  // Split text into paragraphs first to better handle document structure
  const originalParagraphs = original.split(/\n\s*\n/);
  const suggestedParagraphs = suggested.split(/\n\s*\n/);
  
  let result: DiffResult[] = [];
  let currentPos = 0;
  
  // Process each paragraph
  for (let i = 0; i < Math.max(originalParagraphs.length, suggestedParagraphs.length); i++) {
    const origPara = i < originalParagraphs.length ? originalParagraphs[i] : '';
    const suggPara = i < suggestedParagraphs.length ? suggestedParagraphs[i] : '';
    
    if (origPara === suggPara) {
      // Paragraph unchanged
      result.push({
        type: 'unchanged',
        text: origPara,
        startPos: currentPos,
        endPos: currentPos + origPara.length
      });
      currentPos += origPara.length + 2; // +2 for paragraph break
      continue;
    }
    
    // Split paragraphs into sentences for more granular diff
    const origSentences = origPara.split(/(?<=[.!?])\s+/);
    const suggSentences = suggPara.split(/(?<=[.!?])\s+/);
    
    let sentencePos = currentPos;
    
    for (let j = 0; j < Math.max(origSentences.length, suggSentences.length); j++) {
      const origSent = j < origSentences.length ? origSentences[j] : '';
      const suggSent = j < suggSentences.length ? suggSentences[j] : '';
      
      if (origSent === suggSent) {
        // Sentence unchanged
        result.push({
          type: 'unchanged',
          text: origSent + ' ',
          startPos: sentencePos,
          endPos: sentencePos + origSent.length + 1
        });
        sentencePos += origSent.length + 1; // +1 for space
      } else if (origSent && !suggSent) {
        // Sentence deleted
        result.push({
          type: 'deletion',
          text: origSent + ' ',
          startPos: sentencePos,
          endPos: sentencePos + origSent.length + 1
        });
        sentencePos += origSent.length + 1;
      } else if (!origSent && suggSent) {
        // Sentence added
        result.push({
          type: 'addition',
          text: suggSent + ' ',
          startPos: sentencePos,
          endPos: sentencePos + suggSent.length + 1
        });
        sentencePos += suggSent.length + 1;
      } else {
        // Sentence modified - compare words
        const origWords = origSent.split(/\s+/);
        const suggWords = suggSent.split(/\s+/);
        
        let wordPos = sentencePos;
        
        for (let k = 0; k < Math.max(origWords.length, suggWords.length); k++) {
          const origWord = k < origWords.length ? origWords[k] : '';
          const suggWord = k < suggWords.length ? suggWords[k] : '';
          
          if (origWord === suggWord) {
            // Word unchanged
            result.push({
              type: 'unchanged',
              text: origWord + ' ',
              startPos: wordPos,
              endPos: wordPos + origWord.length + 1
            });
            wordPos += origWord.length + 1; // +1 for space
          } else if (origWord && !suggWord) {
            // Word deleted
            result.push({
              type: 'deletion',
              text: origWord + ' ',
              startPos: wordPos,
              endPos: wordPos + origWord.length + 1
            });
            wordPos += origWord.length + 1;
          } else if (!origWord && suggWord) {
            // Word added
            result.push({
              type: 'addition',
              text: suggWord + ' ',
              startPos: wordPos,
              endPos: wordPos + suggWord.length + 1
            });
            wordPos += suggWord.length + 1;
          } else {
            // Word modified
            result.push({
              type: 'deletion',
              text: origWord + ' ',
              startPos: wordPos,
              endPos: wordPos + origWord.length + 1
            });
            result.push({
              type: 'addition',
              text: suggWord + ' ',
              startPos: wordPos,
              endPos: wordPos + suggWord.length + 1
            });
            wordPos += Math.max(origWord.length, suggWord.length) + 1;
          }
        }
        
        sentencePos = wordPos;
      }
    }
    
    currentPos = sentencePos + 2; // +2 for paragraph break
  }
  
  return result;
};

// Function to find word-level differences between two texts (legacy function, kept for compatibility)
const findWordDifferences = (original: string, updated: string) => {
  const originalWords = splitIntoWords(original);
  const updatedWords = splitIntoWords(updated);
  
  // Find removed words (in original but not in updated)
  const removed = originalWords.filter(word => !updated.includes(word));
  
  // Find added words (in updated but not in original)
  const added = updatedWords.filter(word => !original.includes(word));
  
  return { added, removed };
};

const FormSections: React.FC<FormSectionsProps> = ({ 
  gigDescription, 
  updateGigDescription, 
  showAIChanges,
  expandedSections,
  setExpandedSections
}) => {
  const [activeSections, setActiveSections] = useState<string[]>(['title', 'summary', 'companyBackground', 'deliverables', 'skills', 'budget', 'timeline']);
  const [triggerSuggestion, setTriggerSuggestion] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Record<string, { suggested: string, differences: DiffResult[] }>>({});
  const [activeSuggestionSection, setActiveSuggestionSection] = useState<string | null>(null);

  const handleSuggestionReceived = (sectionId: string, suggestedText: string) => {
    // Calculate differences using the more granular approach
    const currentText = gigDescription[sectionId as keyof typeof gigDescription];
    const differences = findTextDifferences(currentText, suggestedText);
    
    setSuggestions(prev => ({
      ...prev,
      [sectionId]: { suggested: suggestedText, differences }
    }));
    setActiveSuggestionSection(sectionId);
  };

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

  const mandatorySections = sections.slice(0, 7);
  const optionalSections = sections.slice(7);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Your Gig Description</h2>
      <p className="text-gray-600 mb-6">Fill out each section to create a comprehensive gig description. Use the AI assistant for suggestions or click the chat icon for more help.</p>
      
      <div className="space-y-4">
        {sections.filter(section => activeSections.includes(section.id)).map((section) => (
          <div key={section.id} className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${
            expandedSections.includes(section.id) ? 'mb-4' : 'border-b-0'
          }`} data-section={section.id}>
            <div className="flex justify-between items-start mb-2">
              <button
                onClick={() => toggleSection(section.id)}
                className="flex-grow flex items-center text-lg font-medium text-gray-800 hover:text-gray-600 mr-2"
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
              <div className="flex items-center space-x-2">
                {!['title', 'summary', 'companyBackground', 'deliverables', 'skills', 'budget', 'timeline'].includes(section.id) && (
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
                  onClick={() => {
                    if (!expandedSections.includes(section.id)) {
                      toggleSection(section.id);
                    }
                    setTriggerSuggestion(section.id);
                  }}
                  className={`group relative p-1.5 rounded-full ${activeSuggestionSection === section.id ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:bg-blue-50 hover:text-blue-600'} transition-colors`}
                  disabled={activeSuggestionSection === section.id}
                >
                  <Sparkles size={16} />
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 whitespace-nowrap text-sm bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    Suggest
                  </span>
                </button>
                <div className="group relative">
                <button className="text-gray-400 hover:text-gray-600">
                  <HelpCircle size={18} />
                </button>
                <div className="absolute right-0 w-64 p-3 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
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
              </div>
              </div>
            </div>
            
            {expandedSections.includes(section.id) && (
              <>
                {section.textArea ? (
                  <div className="relative">
                    <textarea 
                      id={section.id}
                      value={gigDescription[section.id as keyof typeof gigDescription]}
                      onChange={(e) => updateGigDescription(section.id, e.target.value)}
                      placeholder={section.placeholder}
                      rows={4}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        activeSuggestionSection === section.id ? 'bg-gray-100' : ''
                      }`}
                      disabled={activeSuggestionSection === section.id}
                      style={{
                        visibility: suggestions[section.id] ? 'hidden' : 'visible'
                      }}
                    />
                    {suggestions[section.id] && (
                      <div className="absolute inset-0 pointer-events-none overflow-auto">
                        <div className="p-3 whitespace-pre-wrap break-words">
                          {/* Hide the original text */}
                          <div style={{ visibility: 'hidden', display: 'none' }}>
                            {gigDescription[section.id as keyof typeof gigDescription]}
                          </div>
                          
                          {/* Show the differences below */}
                          <div className="absolute top-3 left-3 right-12 whitespace-pre-wrap break-words">
                            {/* Display text with granular differences */}
                            {suggestions[section.id]?.differences.map((diff, i) => {
                              if (diff.type === 'deletion') {
                                return (
                                  <span key={i} className="line-through text-red-600 bg-red-50 rounded px-0.5">
                                    {diff.text}
                                  </span>
                                );
                              } else if (diff.type === 'addition') {
                                return (
                                  <span key={i} className="text-green-600 bg-green-50 rounded px-0.5">
                                    {diff.text}
                                  </span>
                                );
                              } else {
                                return <span key={i}>{diff.text}</span>;
                              }
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <input 
                      type="text"
                      id={section.id}
                      value={gigDescription[section.id as keyof typeof gigDescription]}
                      onChange={(e) => updateGigDescription(section.id, e.target.value)}
                      placeholder={section.placeholder}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        activeSuggestionSection === section.id ? 'bg-gray-100' : ''
                      }`}
                      disabled={activeSuggestionSection === section.id}
                      style={{
                        visibility: suggestions[section.id] ? 'hidden' : 'visible'
                      }}
                    />
                    {suggestions[section.id] && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="px-3 py-2 whitespace-normal overflow-hidden break-words">
                          {/* Display text with granular differences */}
                          {suggestions[section.id]?.differences.map((diff, i) => {
                            if (diff.type === 'deletion') {
                              return (
                                <span key={i} className="line-through text-red-600 bg-red-50 rounded px-0.5">
                                  {diff.text}
                                </span>
                              );
                            } else if (diff.type === 'addition') {
                              return (
                                <span key={i} className="text-green-600 bg-green-50 rounded px-0.5">
                                  {diff.text}
                                </span>
                              );
                            } else {
                              return <span key={i}>{diff.text}</span>;
                            }
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <AIAssistant 
                  section={section.id} 
                  content={gigDescription[section.id as keyof typeof gigDescription]}
                  showChanges={false} 
                  forceSuggestion={triggerSuggestion === section.id}
                  updateContent={(newContent) => {
                    updateGigDescription(section.id, newContent);
                    setSuggestions(prev => {
                      const newSuggestions = {...prev};
                      delete newSuggestions[section.id];
                      return newSuggestions;
                    });
                    setActiveSuggestionSection(null);
                  }}
                  onSuggestionShown={() => {
                    setTriggerSuggestion(null);
                  }}
                  gigDescription={gigDescription}
                  onChangesCalculated={(suggestedText) => handleSuggestionReceived(section.id, suggestedText)}
                />
              </>
            )}
          </div>
        ))}

        {/* Optional Sections */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Optional Sections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {optionalSections.map((section) => (
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
                    {activeSections.includes(section.id) ? (
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