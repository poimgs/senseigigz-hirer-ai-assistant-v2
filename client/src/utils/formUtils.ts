import { FormSection } from '../types/form';

export const isRequiredSection = (section: FormSection): boolean => {
  return section.required;
};
