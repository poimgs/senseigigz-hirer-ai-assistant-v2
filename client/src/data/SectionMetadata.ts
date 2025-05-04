import { Gig } from "../types/gig";

export type SectionMetadataItem = {
  title: string;
  placeholder: string;
  description: string;
  example: string;
  required: boolean;
}

export type SectionMetadataMap = {
  [key in keyof Gig]?: SectionMetadataItem;
}

export const sectionMetadata: SectionMetadataMap = {
  title: {
    title: 'Gig Title',
    placeholder: 'E.g., Senior Mobile App Developer for Fitness Startup',
    description: 'Create a clear, specific title that attracts qualified freelancers',
    example: 'WordPress Website Developer for Local Restaurant',
    required: true
  },
  summary: {
    title: 'Project Summary',
    placeholder: 'Brief overview of the project...',
    description: 'A concise overview of what you need and the project\'s purpose',
    example: 'We need an experienced developer to create a modern, mobile-responsive WordPress website for our family-owned restaurant.',
    required: true
  },
  companyBackground: {
    title: 'Company Background',
    placeholder: 'Brief information about your company...',
    description: 'Provide context about your company and its industry',
    example: 'Our restaurant has been serving authentic Italian cuisine in downtown Portland for over 15 years. We have a loyal customer base but need to modernize our online presence.',
    required: true
  },
  deliverables: {
    title: 'Deliverables',
    placeholder: 'Specific outputs expected from this project...',
    description: 'Define the project scope including deliverables, responsibilities, and success criteria',
    example: '• Custom WordPress theme development\n• Mobile-responsive design\n• Menu management system\n• Integration with online ordering platform\n• Contact form and reservation system\n• SEO optimization\n• Training documentation',
    required: true
  },
  skills: {
    title: 'Required Skills and Qualifications',
    placeholder: 'Skills and experience needed...',
    description: 'List the technical skills and experience required for this project',
    example: '• 3+ years WordPress development experience\n• Strong PHP and MySQL skills\n• Responsive design expertise\n• Knowledge of SEO best practices',
    required: true
  },
  budget: {
    title: 'Budget',
    placeholder: 'Your budget range or rate expectations...',
    description: 'Specify your budget range or desired payment structure',
    example: '• Project budget: $3,000 - $5,000\n• Payment structure: 30% upfront, 70% upon completion\n• Hourly rate range: $50-75/hour',
    required: true
  },
  timeline: {
    title: 'Timeline',
    placeholder: 'Expected project duration and milestones...',
    description: 'Define your timeline expectations and any key milestones',
    example: '• Project duration: 4-6 weeks\n• Key milestones:\n  - Week 1: Design approval\n  - Week 2-3: Development\n  - Week 4: Testing and revisions\n  - Week 5: Launch and training',
    required: true
  },
  communication: {
    title: 'Communication Preferences',
    placeholder: 'How and when you prefer to communicate...',
    description: 'Specify your preferred communication methods and expectations',
    example: '• Weekly progress meetings via Zoom\n• Daily updates via Slack\n• Email for formal documentation\n• Available during EST business hours',
    required: false
  },
  ownership: {
    title: 'Ownership and Intellectual Property',
    placeholder: 'Who will own the work product and any IP?',
    description: 'Clearly define who will own the finished work and intellectual property',
    example: '• All final deliverables and code will be the exclusive property of [Company Name]\n• Freelancer will transfer all rights upon final payment\n• Freelancer may include the project in their portfolio with approval',
    required: false
  },
  confidentiality: {
    title: 'Confidentiality and NDA Requirements',
    placeholder: 'Any confidentiality requirements...',
    description: 'Specify if an NDA is required and any confidentiality concerns',
    example: '• Standard NDA will be required before project commencement\n• Access to internal systems will require confidentiality agreement\n• All customer data must be handled according to our privacy policy',
    required: false
  },
  notes: {
    title: 'Additional Notes',
    placeholder: 'Any other important information...',
    description: 'Include any other relevant information not covered above',
    example: '• We have some existing brand assets available for use\n• We are open to suggestions on improving our online ordering process\n• Previous experience with Square POS integration is a plus',
    required: false
  }
};
