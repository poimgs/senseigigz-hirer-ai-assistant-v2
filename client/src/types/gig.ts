export interface GigDescription {
  title: string;
  summary: string;
  companyBackground: string;
  deliverables: string;
  skills: string;
  budget: string;
  timeline: string;
  communication: string;
  ownership: string;
  confidentiality: string;
  notes: string;
}

interface GigField {
  content: string;
  suggestion: string;
  explanation: string;
}

export interface Gig {
  title: GigField;
  summary: GigField;
  companyBackground: GigField;
  deliverables: GigField;
  skills: GigField;
  budget: GigField;
  timeline: GigField;
  communication: GigField;
  ownership: GigField;
  confidentiality: GigField;
  notes: GigField;
}

export const INITIAL_GIG: Gig = {
  title: { content: '', suggestion: '', explanation: '' },
  summary: { content: '', suggestion: '', explanation: '' },
  companyBackground: { content: '', suggestion: '', explanation: '' },
  deliverables: { content: '', suggestion: '', explanation: '' },
  skills: { content: '', suggestion: '', explanation: '' },
  budget: { content: '', suggestion: '', explanation: '' },
  timeline: { content: '', suggestion: '', explanation: '' },
  communication: { content: '', suggestion: '', explanation: '' },
  ownership: { content: '', suggestion: '', explanation: '' },
  confidentiality: { content: '', suggestion: '', explanation: '' },
  notes: { content: '', suggestion: '', explanation: '' }
};
