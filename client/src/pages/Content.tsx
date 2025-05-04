import React from 'react';
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
  Edit2,
  AlertCircle
} from 'lucide-react';
import Section from '../components/Section';
import Header from '../components/Header';
import Modal from '../components/Modal';

function Content() {
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

  const handleUpdateGigDescription = (section: keyof GigDescription, value: string) => {
    setGigDescriptionState(prev => ({
      ...prev,
      [section]: value
    }));
  };

  const generateSuggestion = (section: keyof GigDescription, content: string) => {
    generateSuggestionBase(section, content, gigDescriptionState);
  };

  const handleEnhanceSuggestion = (section: keyof GigDescription, content: string) => {
    handleEnhanceSuggestionBase(section, content, gigDescriptionState);
  };

  const handleAcceptSuggestion = (newContent: string) => {
    handleAcceptSuggestionBase(newContent, handleUpdateGigDescription);
  };

  const handleCloseDialog = () => {
    setEditingSection(null);
  };

  const renderSection = (sectionId: string) => {
    const section = formSections.find(s => s.id === sectionId);
    if (!section) return null;

    const content = gigDescriptionState[sectionId as keyof GigDescription];
    const isEmpty = !content || content.trim() === '';
    const isRequired = section.required;

    return (
      <div key={sectionId} className="mb-8 pb-8 border-b border-gray-200 last:border-b-0">
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
                onClick={() => setEditingSection(sectionId)}
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
                    {gigDescriptionState.title || (
                      <span className="text-gray-400 italic">Add a title for your project</span>
                    )}
                  </h1>
                  <button
                    onClick={() => setEditingSection('title')}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded-full transition-all"
                    title="Edit title"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* All Sections */}
              <div className="space-y-2">
                {formSections.slice(1).map(section => renderSection(section.id))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={!!editingSection} onClose={() => setEditingSection(null)}>
        <div className="max-h-[85vh] overflow-y-auto">
          {editingSection && (
            <Section />
          )}
        </div>
      </Modal>
    </>
  );
}

export default Content;
