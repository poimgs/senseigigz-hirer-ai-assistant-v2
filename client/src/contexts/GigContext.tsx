import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Gig, INITIAL_GIG } from '../types/gig';
import apiService from '../services/apiService';

// Define the state structure
interface GigState {
  gig: Gig;
  loading: boolean;
}

// Define action types
type GigAction = 
  | { type: 'UPDATE_CONTENT'; payload: { field: keyof Gig; content: string } }
  | { type: 'UPDATE_SUGGESTION'; payload: { field: keyof Gig; suggestion: string } }
  | { type: 'UPDATE_EXPLANATION'; payload: { field: keyof Gig; explanation: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_SUGGESTIONS' }
  | { type: 'RESET' };

// Initial state
const initialGigState: GigState = {
  gig: INITIAL_GIG,
  loading: false
};

// Reducer function
const gigReducer = (state: GigState, action: GigAction): GigState => {
  switch (action.type) {
    case 'UPDATE_CONTENT':
      return {
        ...state,
        gig: {
          ...state.gig,
          [action.payload.field]: {
            ...state.gig[action.payload.field],
            content: action.payload.content
          }
        }
      };
    case 'UPDATE_SUGGESTION':
      return {
        ...state,
        gig: {
          ...state.gig,
          [action.payload.field]: {
            ...state.gig[action.payload.field],
            suggestion: action.payload.suggestion
          }
        }
      };
    case 'UPDATE_EXPLANATION':
      return {
        ...state,
        gig: {
          ...state.gig,
          [action.payload.field]: {
            ...state.gig[action.payload.field],
            explanation: action.payload.explanation
          }
        }
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'CLEAR_SUGGESTIONS':
      const clearedGig = Object.entries(state.gig).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: { ...value, suggestion: '', explanation: '' }
      }), {} as Gig);
      return {
        ...state,
        gig: clearedGig
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

  const updateContent = (field: keyof Gig, content: string) => {
    dispatch({ type: 'UPDATE_CONTENT', payload: { field, content } });
  };

  const updateSuggestion = (field: keyof Gig, suggestion: string) => {
    dispatch({ type: 'UPDATE_SUGGESTION', payload: { field, suggestion } });
  };

  const clearSuggestions = () => {
    dispatch({ type: 'CLEAR_SUGGESTIONS' });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  const generateSuggestion = async (section: keyof Gig) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await apiService.improveSection(section, state.gig, state.gig[section].suggestion);
      dispatch({ type: 'UPDATE_SUGGESTION', payload: { field: section, suggestion: data.suggestion || '' } });
      dispatch({ type: 'UPDATE_EXPLANATION', payload: { field: section, explanation: data.explanation || '' } });
    } catch (error) {
      console.error('Error generating suggestion:', error);
      dispatch({ type: 'UPDATE_SUGGESTION', payload: { field: section, suggestion: 'Sorry, I encountered an error. Please try again later.' } });
      dispatch({ type: 'UPDATE_EXPLANATION', payload: { field: section, explanation: 'Sorry, I encountered an error. Please try again later.' } })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleAcceptSuggestion = (section: keyof Gig) => {
    const suggestion = state.gig[section].suggestion;
    if (suggestion) {
      updateContent(section, suggestion);
      updateSuggestion(section, '');
    }
  };

  const handleDismissSuggestion = (section: keyof Gig) => {
    updateSuggestion(section, '');
  };

  return {
    gig: state.gig,
    loading: state.loading,
    updateContent,
    updateSuggestion,
    clearSuggestions,
    reset,
    generateSuggestion,
    handleAcceptSuggestion,
    handleDismissSuggestion
  };
}
