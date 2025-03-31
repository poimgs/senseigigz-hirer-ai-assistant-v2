import { useState } from 'react';
import { GigDescription } from '../types/gig';
import { SuggestionData, SuggestionsState } from '../types/suggestion';
import apiService from '../services/apiService';
import { findTextDifferences } from '../utils/textUtils';

export function useSuggestions() {
  const [suggestionData, setSuggestionData] = useState<SuggestionsState>({});
  const [loading, setLoading] = useState(false);
  const [activeSuggestionSection, setActiveSuggestionSection] = useState<string | null>(null);

  const generateSuggestion = async (section: keyof GigDescription, content: string, gigDescription: GigDescription) => {
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
      const differences = findTextDifferences(content, suggestedText);
      
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

  const handleEnhanceSuggestion = async (section: keyof GigDescription, content: string, gigDescription: GigDescription) => {
    setLoading(true);
    try {
      // Create a copy of gigDescription and clear the content of the target section
      const gigDescriptionCopy = { ...gigDescription };
      gigDescriptionCopy[section] = '';
      
      const data = await apiService.improveSection(section, content, gigDescriptionCopy);
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
      const explanation = parsedData?.explanation || 'Enhanced AI-generated suggestion for improving this section.';
      const differences = findTextDifferences(content, suggestedText);
      
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
      console.error('Error enhancing suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSuggestion = (newContent: string, updateGigDescription: (section: keyof GigDescription, value: string) => void) => {
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

  const hasActiveSuggestion = Object.values(suggestionData).some(suggestion => suggestion !== null);

  return {
    loading,
    suggestionData,
    hasActiveSuggestion,
    generateSuggestion,
    handleEnhanceSuggestion,
    handleAcceptSuggestion,
    handleDismissSuggestion
  };
}
