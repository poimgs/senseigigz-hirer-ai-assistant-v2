import React from 'react';
import { Sparkles, Check, X } from 'lucide-react';
import { SectionSuggestion } from '../types/suggestion';

interface AIAssistantProps {
  suggestion: SectionSuggestion | null;
  loading: boolean;
  handleAcceptSuggestion: (newContent: string) => void;
  handleDismissSuggestion: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  suggestion,
  loading,
  handleAcceptSuggestion,
  handleDismissSuggestion
}) => {

  if (loading) {
    return (
      <div className="mt-3 flex items-center text-sm text-gray-500">
        <Sparkles size={16} className="mr-2 text-blue-500" />
        <span>AI is analyzing your input...</span>
      </div>
    );
  }

  if (!suggestion) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <Sparkles size={18} className="mr-2 text-blue-500" />
          <h3 className="font-medium text-blue-800">AI Suggestion</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleAcceptSuggestion(suggestion.suggestedUpdate)}
            className="flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            <Check size={16} className="mr-1" />
            Accept
          </button>
          <button
            onClick={handleDismissSuggestion}
            className="flex items-center px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            <X size={16} className="mr-1" />
            Dismiss
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="text-gray-700 text-sm bg-white p-3 rounded-lg border border-blue-200 shadow-sm whitespace-pre-wrap break-words overflow-auto max-h-64 hover:shadow-md transition-shadow duration-200">
          {suggestion.suggestedUpdate}
        </div>
        {suggestion.explanation && (
          <div className="text-gray-600 text-xs p-3 bg-gray-50 rounded-lg border border-gray-200 font-medium break-words hover:bg-gray-100 transition-colors duration-200">
            <div className="font-semibold text-blue-600 mb-1">Explanation:</div>
            {suggestion.explanation}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;