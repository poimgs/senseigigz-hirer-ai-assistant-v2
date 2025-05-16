export interface Gig {
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

export const INITIAL_GIG: Gig = {
  title: '',
  summary: '',
  companyBackground: '',
  deliverables: '',
  skills: '',
  budget: '',
  timeline: '',
  communication: '',
  ownership: '',
  confidentiality: '',
  notes: ''
};
