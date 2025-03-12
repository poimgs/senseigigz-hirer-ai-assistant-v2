import { FormSection } from '../types/form';

export const formSections: FormSection[] = [
  {
    id: 'title',
    title: 'Gig Title',
    placeholder: 'E.g., Senior Mobile App Developer for Fitness Startup',
    description: 'Create a clear, specific title that attracts qualified freelancers',
    example: 'WordPress Website Developer for Local Restaurant',
  },
  {
    id: 'summary',
    title: 'Project Summary',
    placeholder: 'Brief overview of the project...',
    description: 'A concise overview of what you need and the project\'s purpose',
    example: 'We need an experienced developer to create a modern, mobile-responsive WordPress website for our family-owned restaurant.',
    textArea: true,
  },
  {
    id: 'companyBackground',
    title: 'Company Background',
    placeholder: 'Brief information about your company...',
    description: 'Provide context about your company and its industry',
    example: 'Our restaurant has been serving authentic Italian cuisine in downtown Portland for over 15 years. We have a loyal customer base but need to modernize our online presence.',
    textArea: true,
  },
  {
    id: 'deliverables',
    title: 'Deliverables',
    placeholder: 'Specific outputs expected from this project...',
    description: 'Define the project scope including deliverables, responsibilities, and success criteria',
    example: '• A fully functional WordPress website with 5-7 pages\n• Mobile-responsive design\n• Integration with our reservation system\n• SEO optimization for local search',
    textArea: true,
    additionalInfo: {
      responsibilities: {
        title: 'Key Responsibilities',
        description: 'Main tasks the freelancer will handle:',
        example: '• Design website layout and structure based on brand guidelines\n• Implement and customize WordPress theme\n• Set up necessary plugins\n• Provide basic staff training'
      },
      successCriteria: {
        title: 'Success Criteria',
        description: 'How success will be measured:',
        example: '• Website loads in under 3 seconds\n• Passes Google PageSpeed tests\n• Staff can update content independently\n• Reservation system works correctly'
      }
    }
  },
  {
    id: 'skills',
    title: 'Required Skills and Qualifications',
    placeholder: 'Skills and experience needed...',
    description: 'List both technical skills and relevant experience required',
    example: '• 3+ years of WordPress development experience\n• Proficiency with PHP, HTML, CSS, and JavaScript\n• Experience with restaurant or hospitality websites\n• Knowledge of SEO best practices\n• Portfolio showing similar projects',
    textArea: true,
  },
  {
    id: 'budget',
    title: 'Budget and Payment Terms',
    placeholder: 'Budget range and payment structure...',
    description: 'Clearly state your budget range and how/when you\'ll make payments',
    example: '• Budget range: $2,000-$3,000\n• Payment structure: 30% upfront, 30% at midpoint approval, 40% upon completion\n• Payment made via PayPal or bank transfer within 7 days of invoicing',
    textArea: true,
  },
  {
    id: 'timeline',
    title: 'Timeline and Milestones',
    placeholder: 'Project timeline, key milestones and deadlines...',
    description: 'Outline the project schedule and key milestones',
    example: '• Project start: June 1, 2025\n• Initial design concepts: June 15\n• Development completion: July 15\n• Testing and revisions: July 15-30\n• Final delivery: August 1',
    textArea: true,
  },
  {
    id: 'communication',
    title: 'Communication and Collaboration',
    placeholder: 'How will you communicate with the freelancer?',
    description: 'Specify your preferred communication methods and expectations',
    example: '• Weekly progress meetings via Zoom\n• Day-to-day communication through Slack\n• Shared Trello board for task tracking\n• Expectation of same-day responses during business hours',
    textArea: true,
  },
  {
    id: 'ownership',
    title: 'Ownership and Intellectual Property',
    placeholder: 'Who will own the work product and any IP?',
    description: 'Clearly define who will own the finished work and intellectual property',
    example: '• All final deliverables and code will be the exclusive property of [Company Name]\n• Freelancer will transfer all rights upon final payment\n• Freelancer may include the project in their portfolio with approval',
    textArea: true,
  },
  {
    id: 'confidentiality',
    title: 'Confidentiality and NDA Requirements (Optional)',
    placeholder: 'Any confidentiality requirements...',
    description: 'Specify if an NDA is required and any confidentiality concerns',
    example: '• Standard NDA will be required before project commencement\n• Access to internal systems will require confidentiality agreement\n• All customer data must be handled according to our privacy policy',
    textArea: true,
  },
  {
    id: 'notes',
    title: 'Additional Notes',
    placeholder: 'Any other important information...',
    description: 'Include any other relevant information not covered above',
    example: '• We have some existing brand assets available for use\n• We are open to suggestions on improving our online ordering process\n• Previous experience with Square POS integration is a plus',
    textArea: true,
  },
];

export const requiredSections = formSections.slice(0, 7);
export const optionalSections = formSections.slice(7);
