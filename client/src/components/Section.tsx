import React from 'react';
import { AlertCircle, Edit2 } from 'lucide-react';
import { Gig } from '../types/gig';
import { SectionMetadataMap } from '../data/SectionMetadata';

interface SectionProps {
  sectionId: string;
  gig: Gig;
  sectionMetadata: SectionMetadataMap;
  sectionIcons: Record<string, React.ReactNode>;
  onEditSection: (sectionId: keyof Gig) => void;
}

const Section: React.FC<SectionProps> = ({
  sectionId,
  gig,
  sectionMetadata,
  sectionIcons,
  onEditSection,
}) => {
  const section = sectionMetadata[sectionId as keyof Gig];
  if (!section) return null;

  const content = gig[sectionId as keyof Gig];
  const isEmpty = !content || content.trim() === '';
  const isRequired = section.required;

  return (
    <div className="mb-8 pb-8 border-b border-gray-200 last:border-b-0">
      <div className="group">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-2 flex-grow">
              {sectionIcons[sectionId]}
              <h3 className="text-xl font-serif">{section.title}</h3>
              {isEmpty && isRequired && (
                <span className="text-sm px-2 py-1 rounded bg-red-50 text-red-600 border border-red-200">
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Required</span>
                  </div>
                </span>
              )}
            </div>
            <button
              onClick={() => onEditSection(sectionId as keyof Gig)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded-full transition-all"
              title="Edit section"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="prose prose-gray max-w-none">
            {isEmpty ? (
              <div className={`italic ${isRequired ? 'text-gray-400' : 'text-gray-300'}`}>
                {isRequired 
                  ? 'This section requires content. Click the edit button to add details.'
                  : 'Optional section'}
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{content}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section;
