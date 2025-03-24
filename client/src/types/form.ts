import { GigDescription } from './gig';

export interface AdditionalInfo {
  title: string;
  description: string;
  example: string;
}

export interface FormSection {
  id: keyof GigDescription;
  title: string;
  placeholder: string;
  description: string;
  example: string;
  textArea?: boolean;
  required: boolean;
  additionalInfo?: {
    responsibilities?: AdditionalInfo;
    successCriteria?: AdditionalInfo;
  };
}

// Interface for diff result
export interface DiffResult {
  type: 'addition' | 'deletion' | 'unchanged';
  text: string;
  startPos?: number;
  endPos?: number;
}
