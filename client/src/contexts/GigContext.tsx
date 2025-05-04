import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Gig, INITIAL_GIG } from '../types/gig';
import apiService from '../services/apiService';
import { sectionMetadata, SectionMetadataItem } from '../data/SectionMetadata';

// Define the state structure
interface GigState {
  gig: Gig;
  activeSection: keyof Gig | null;
  metadata: SectionMetadataItem | null;
  suggestion: string;
  explanation: string;
  loading: boolean;
}

// Define action types
type GigAction = 
  | { type: 'SET_CONTENT'; payload: { content: string } }
  | { type: 'SET_ACTIVE_SECTION'; payload: keyof Gig | null }
  | { type: 'SET_METADATA'; payload: SectionMetadataItem | null }
  | { type: 'SET_SUGGESTION'; payload: string }
  | { type: 'SET_EXPLANATION'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_SUGGESTION' }
  | { type: 'CLEAR_EXPLANATION' }
  | { type: 'RESET' };

// Initial state
const initialGigState: GigState = {
  gig: INITIAL_GIG,
  activeSection: null,
  metadata: null,
  suggestion: '',
  explanation: '',
  loading: false
};

// Reducer function
const gigReducer = (state: GigState, action: GigAction): GigState => {
  switch (action.type) {
    case 'SET_CONTENT':
      if (!state.activeSection) return state;
      return {
        ...state,
        gig: {
          ...state.gig,
          [state.activeSection]: action.payload.content
        }
      };
    case 'SET_ACTIVE_SECTION':
      return {
        ...state,
        activeSection: action.payload,
        // Update metadata when changing sections
        metadata: action.payload ? sectionMetadata[action.payload] || null : null,
        // Clear suggestion and explanation when changing sections
        suggestion: '',
        explanation: ''
      };
    case 'SET_SUGGESTION':
      return {
        ...state,
        suggestion: action.payload
      };
    case 'SET_EXPLANATION':
      return {
        ...state,
        explanation: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'CLEAR_SUGGESTION':
      return {
        ...state,
        suggestion: ''
      };
    case 'CLEAR_EXPLANATION':
      return {
        ...state,
        explanation: ''
      };
    case 'RESET':
      return initialGigState;
    default:
      return state;
  }
};

// Create context with types
interface GigContextType {
  state: GigState;
  dispatch: React.Dispatch<GigAction>;
}

const GigContext = createContext<GigContextType | undefined>(undefined);

// Provider component
export function GigProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gigReducer, initialGigState);

  return (
    <GigContext.Provider value={{ state, dispatch }}>
      {children}
    </GigContext.Provider>
  );
}

// Custom hook for using the gig context
export function useGig() {
  const context = useContext(GigContext);
  if (context === undefined) {
    throw new Error('useGig must be used within a GigProvider');
  }
  return context;
}

// Custom hook for gig operations
export function useGigOperations() {
  const { state, dispatch } = useGig();

  const setContent = (content: string) => {
    dispatch({ type: 'SET_CONTENT', payload: { content } });
  };

  const setActiveSection = (section: keyof Gig | null) => {
    dispatch({ type: 'SET_ACTIVE_SECTION', payload: section });
    clearSuggestion();
  };

  const setSuggestion = (suggestion: string) => {
    dispatch({ type: 'SET_SUGGESTION', payload: suggestion });
  };

  const clearSuggestion = () => {
    dispatch({ type: 'CLEAR_SUGGESTION' });
    dispatch({ type: 'CLEAR_EXPLANATION' });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  const generateSuggestion = async (section: keyof Gig) => {
    if (section !== state.activeSection) {
      setActiveSection(section);
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await apiService.improveSection(section, state.gig, state.suggestion);
      dispatch({ type: 'SET_SUGGESTION', payload: data.suggestion || '' });
      dispatch({ type: 'SET_EXPLANATION', payload: data.explanation || '' });
    } catch (error) {
      console.error('Error generating suggestion:', error);
      dispatch({ type: 'SET_SUGGESTION', payload: 'Sorry, I encountered an error. Please try again later.' });
      dispatch({ type: 'SET_EXPLANATION', payload: 'Sorry, I encountered an error. Please try again later.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleAcceptSuggestion = () => {
    if (state.activeSection && state.suggestion) {
      setContent(state.suggestion);
      clearSuggestion();
    }
  };

  const handleDismissSuggestion = () => {
    clearSuggestion();
  };

  return {
    gig: state.gig,
    activeSection: state.activeSection,
    metadata: state.metadata,
    suggestion: state.suggestion,
    explanation: state.explanation,
    loading: state.loading,
    setContent,
    setSuggestion,
    setActiveSection,
    clearSuggestion,
    reset,
    generateSuggestion,
    handleAcceptSuggestion,
    handleDismissSuggestion
  };
}
