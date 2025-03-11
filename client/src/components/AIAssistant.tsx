import React, { useState, useEffect } from 'react';
import { Sparkles, Check, X } from 'lucide-react';

interface AIAssistantProps {
  section: string;
  content: string;
  showChanges?: boolean;
  forceSuggestion?: boolean;
  updateContent: (newContent: string) => void;
  onSuggestionShown?: () => void;
  gigDescription?: Record<string, string>;
  onChangesCalculated?: (suggestedText: string, changes: { added: string[], removed: string[] }) => void;
}

// API service for OpenAI interactions
const apiService = {
  // Base URL for API calls
  baseUrl: 'http://localhost:3001/api',

  // Get improvement suggestions for a specific section
  async improveSection(section: string, content: string, gigDescription: Record<string, string>) {
    try {
      const response = await fetch(`${this.baseUrl}/improve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          content,
          gigDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling improve API:', error);
      return {
        text: 'Sorry, I encountered an error. Please try again later.',
      };
    }
  },
};

interface SuggestionData {
  section: string;
  suggested_update: string;
  explanation: string;
}

// Function to split text into words while preserving whitespace and punctuation
const splitIntoWords = (text: string): string[] => {
  // This regex captures words, whitespace, and punctuation as separate tokens
  return text.match(/\S+|\s+|[,.!?;:()\[\]{}"']/g) || [];
};

// Function to find word-level differences between two texts
const findWordDifferences = (original: string, updated: string) => {
  const originalWords = splitIntoWords(original);
  const updatedWords = splitIntoWords(updated);
  
  // Find removed words (in original but not in updated)
  const removed = originalWords.filter(word => !updated.includes(word));
  
  // Find added words (in updated but not in original)
  const added = updatedWords.filter(word => !original.includes(word));
  
  return { added, removed };
};

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  section, 
  content, 
  showChanges = false, 
  forceSuggestion = false,
  updateContent,
  onSuggestionShown,
  gigDescription = {},
  onChangesCalculated,
}) => {
  const [suggestionData, setSuggestionData] = useState<SuggestionData | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [changes, setChanges] = useState<{ added: string[]; removed: string[]; }>({ added: [], removed: [] });

  // Force suggestion when button is clicked
  useEffect(() => {
    if (forceSuggestion) {
      generateSuggestion();
    }
  }, [forceSuggestion]);

  const generateSuggestion = async () => {
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
      }
      
      if (parsedData && parsedData.suggested_update) {
        setSuggestionData(parsedData);
        setShowSuggestion(true);
        
        if (showChanges || forceSuggestion || onChangesCalculated) {
          // Calculate word-level differences
          const calculatedChanges = findWordDifferences(content, parsedData.suggested_update);
          
          setChanges(calculatedChanges);
          
          // Notify parent component about the changes
          onChangesCalculated?.(parsedData.suggested_update, calculatedChanges);
        }
      } else {
        // Fallback to the old format if JSON parsing fails
        const newSuggestion = data.suggestion || '';
        setSuggestionData({
          section,
          suggested_update: newSuggestion,
          explanation: 'AI-generated suggestion for improving this section.'
        });
        setShowSuggestion(true);
        
        if (showChanges || forceSuggestion || onChangesCalculated) {
          // Calculate word-level differences
          const calculatedChanges = findWordDifferences(content, newSuggestion);
          
          setChanges(calculatedChanges);
          
          // Notify parent component about the changes
          onChangesCalculated?.(newSuggestion, calculatedChanges);
        }
      }
      
      onSuggestionShown?.();
    } catch (error) {
      console.error('Error generating suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate AI suggestion when content changes
  useEffect(() => {
    if (!forceSuggestion && content && content.length > 10 && Math.random() > 0.7) {
      // Only generate suggestions occasionally and when there's enough content
      const timer = setTimeout(() => {
        generateSuggestion();
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setSuggestionData(null);
      setShowSuggestion(false);
    }
  }, [content, section]);

  const handleAcceptSuggestion = () => {
    if (suggestionData) {
      updateContent(suggestionData.suggested_update);
      setShowSuggestion(false);
    }
  };

  const handleDismissSuggestion = () => {
    setShowSuggestion(false);
  };

  if (loading) {
    return (
      <div className="mt-3 flex items-center text-sm text-gray-500">
        <Sparkles size={16} className="mr-2 text-blue-500" />
        <span>AI is analyzing your input...</span>
      </div>
    );
  }

  if (!showSuggestion || !suggestionData) {
    return null;
  }
  
  const renderSuggestion = () => {
    if (!showChanges) {
      return (
        <div className="space-y-3">
          <div className="text-gray-700 text-sm bg-white p-2 rounded border border-blue-100 whitespace-pre-wrap break-words overflow-auto max-h-64">
            {suggestionData.suggested_update}
          </div>
          {suggestionData.explanation && (
            <div className="text-gray-600 text-xs p-2 bg-gray-50 rounded border border-gray-100 font-medium break-words">
              {suggestionData.explanation}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="text-gray-700 text-sm bg-white p-2 rounded border border-blue-100 whitespace-pre-wrap break-words overflow-auto max-h-64">
          {/* Display original text with word-level differences */}
          {splitIntoWords(content).map((word, i) => {
            if (changes.removed.includes(word)) {
              return (
                <span key={i} className="line-through text-red-600 bg-red-50 rounded px-1">
                  {word}
                </span>
              );
            }
            return <span key={i}>{word}</span>;
          })}
          
          {/* Show a separator if there are additions */}
          {changes.added.length > 0 && (
            <div className="border-t border-gray-200 my-2 pt-2">
              <div className="text-xs text-gray-500 mb-1">Suggested additions:</div>
              <div className="flex flex-wrap gap-1">
                {changes.added.map((word, i) => (
                  <span key={`added-${i}`} className="text-green-600 bg-green-50 rounded px-1">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        {suggestionData.explanation && (
          <div className="text-gray-600 text-xs p-2 bg-gray-50 rounded border border-gray-100 font-medium break-words">
            {suggestionData.explanation}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-3 border border-blue-100 bg-blue-50 rounded-md p-3">
      <div className="flex items-center mb-2">
        <Sparkles size={16} className="mr-2 text-blue-500" />
        <span className="text-sm font-medium text-blue-800">AI Suggestion</span>
      </div>
      
      {renderSuggestion()}
      
      <div className="flex justify-end mt-2 space-x-2 sticky bottom-0 bg-blue-50 pt-2 pb-1 px-2 -mx-2 -mb-2 rounded-b">
        <button 
          onClick={handleDismissSuggestion}
          className="text-gray-600 hover:text-gray-800 text-xs flex items-center"
        >
          <X size={14} className="mr-1" />
          Dismiss
        </button>
        <button 
          onClick={handleAcceptSuggestion}
          className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded text-xs flex items-center"
        >
          <Check size={14} className="mr-1" />
          Apply
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;