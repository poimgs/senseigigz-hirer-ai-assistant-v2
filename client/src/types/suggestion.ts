import { GigDescription } from './gig';
import { DiffResult } from '../utils/textUtils';

export interface SuggestionData {
  section: keyof GigDescription;
  suggested_update: string;
  explanation: string;
}

/**
 * Represents a suggestion for a specific section
 */
export interface SectionSuggestion {
  suggestedUpdate: string;
  explanation: string;
  differences: DiffResult[];
}

/**
 * Maps section IDs to their suggestions
 */
export type SuggestionsState = Record<string, SectionSuggestion>;