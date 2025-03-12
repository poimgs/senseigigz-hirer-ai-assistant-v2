import { GigDescription } from './gig';

export interface AdditionalInfo {
  title: string;
  description: string;
  example: string;
}

export type RequiredSectionId = 'title' | 'summary' | 'companyBackground' | 'deliverables' | 'skills' | 'budget' | 'timeline';

export interface FormSection {
  id: keyof GigDescription;
  title: string;
  placeholder: string;
  description: string;
  example: string;
  textArea?: boolean;
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
