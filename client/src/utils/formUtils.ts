import { GigDescription } from '../types/gig';
import { RequiredSectionId } from '../types/form';

export const isRequiredSection = (id: keyof GigDescription): boolean => {
  const requiredSections: RequiredSectionId[] = ['title', 'summary', 'companyBackground', 'deliverables', 'skills', 'budget', 'timeline'];
  return requiredSections.includes(id as RequiredSectionId);
};
