import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Building2, 
  PackageCheck, 
  Briefcase, 
  PiggyBank, 
  Clock, 
  MessageSquare, 
  Shield, 
  Lock, 
  StickyNote,
  Edit2
} from 'lucide-react';
import ModalContent from '../components/ModalContent';
import Section from '../components/Section';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { useGigOperations } from '../contexts/GigContext';
import { Gig } from '../types/gig';
import { sectionMetadata } from '../data/SectionMetadata';

function Content() {
  const [editingSection, setEditingSection] = useState<boolean>(false);
  const [originalContent, setOriginalContent] = useState<string>('');
  const { 
    gig, 
    activeSection, 
    setActiveSection,
    setContent,
    suggestion,
    handleAcceptSuggestion
  } = useGigOperations();

  const sectionIcons: Record<string, React.ReactNode> = {
    title: <LayoutDashboard className="w-5 h-5" />,
    summary: <FileText className="w-5 h-5" />,
    companyBackground: <Building2 className="w-5 h-5" />,
    deliverables: <PackageCheck className="w-5 h-5" />,
    skills: <Briefcase className="w-5 h-5" />,
    budget: <PiggyBank className="w-5 h-5" />,
    timeline: <Clock className="w-5 h-5" />,
    communication: <MessageSquare className="w-5 h-5" />,
    ownership: <Shield className="w-5 h-5" />,
    confidentiality: <Lock className="w-5 h-5" />,
    notes: <StickyNote className="w-5 h-5" />
  };

  const handleOpenSection = (section: keyof Gig) => {
    setEditingSection(true);
    setActiveSection(section);
    setOriginalContent(gig[section]);
  };

  const handleConfirm = () => {
    if (suggestion) {
      handleAcceptSuggestion();
    }
    setEditingSection(false);
    setActiveSection(null);
  };

  const handleCancel = () => {
    setContent(originalContent);
    setEditingSection(false);
    setActiveSection(null);
  };



  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-[800px] mx-auto px-8">
          <div className="bg-white shadow-sm border border-gray-200 rounded-sm">
            <div className="p-12">
              {/* Title */}
              <div className="text-center mb-12 pb-8 border-b border-gray-200 group">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <h1 className="text-3xl font-serif">
                    {gig.title || (
                      <span className="text-gray-400 italic">Add a title for your project</span>
                    )}
                  </h1>
                  <button
                    onClick={() => handleOpenSection('title')}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded-full transition-all"
                  >
                    <span
                      className="group relative inline-block"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                      <div 
                        className="hidden group-hover:block absolute w-48 p-2 bg-gray-800 text-white text-sm text-left rounded shadow-lg z-50 bottom-0 transform translate-x-6 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        Edit project title
                      </div>
                    </span>
                  </button>
                </div>
              </div>

              {/* All Sections */}
              <div className="space-y-2">
                {Object.keys(sectionMetadata)
                  .filter(key => key !== 'title')
                  .map(sectionId => (
                    <Section
                      key={sectionId}
                      sectionId={sectionId}
                      gig={gig}
                      sectionMetadata={sectionMetadata}
                      sectionIcons={sectionIcons}
                      onEditSection={handleOpenSection}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={editingSection} onConfirm={handleConfirm} onClose={handleCancel}>
        <div className="max-h-[85vh] overflow-y-auto">
          {editingSection && activeSection && (
            <ModalContent />
          )}
        </div>
      </Modal>
    </>
  );
}

export default Content;
