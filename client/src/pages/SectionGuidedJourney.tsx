import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import { sectionMetadata, guidedJourneyOrder } from '../data/SectionMetadata';
import { Gig } from '../types/gig';
import AIAssistant from '../components/AIAssistant';
import { useGigOperations } from '../contexts/GigContext';

// Create a type for the section IDs
type SectionId = typeof guidedJourneyOrder[number];

// Utility function to get section index
const getSectionIndex = (sectionId: SectionId): number => {
  return guidedJourneyOrder.indexOf(sectionId);
};

const SectionGuidedJourney: React.FC = () => {
  const navigate = useNavigate();
  const { sectionId } = useParams<{ sectionId?: SectionId }>();
  const [error, setError] = React.useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Validate sectionId
  if (!sectionId || !guidedJourneyOrder.includes(sectionId as SectionId)) {
    navigate('/guided-journey');
    return null;
  }
  
  // Use GigContext operations
  const {
    gig,
    setContent,
    suggestion,
    generateSuggestion,
    reset,
    loading,
    handleAcceptSuggestion,
    setActiveSection
  } = useGigOperations();

  const adjustTextareaHeight = () => {
    textareaRef.current!.style.height = 'auto';
    textareaRef.current!.style.height = `${textareaRef.current!.scrollHeight + 4}px`;
  };
  
  // Adjust height whenever the content changes from context
  useEffect(() => {
    if (textareaRef.current) {
      adjustTextareaHeight();
    }
  }, [gig[sectionId as keyof Gig]]);

  const handleNext = () => {
    const currentIndex = getSectionIndex(sectionId);

    if (suggestion) {
      handleAcceptSuggestion();
    } else if (!gig[sectionId].trim()) {
      setError(`Please complete the ${sectionMetadata[sectionId]!.title} section`);
      return;
    }

    if (currentIndex === guidedJourneyOrder.length - 1) {
      // If this is the last section, navigate to content
      navigate('/content', { state: { gigDescription: gig } });
    } else {
      const nextSectionId = guidedJourneyOrder[currentIndex + 1];
      navigate(`/guided-journey/${nextSectionId}`);
      setError(null);
      
      // Generate suggestions for the next section
      if (nextSectionId === 'companyBackground') {
        // Only generate suggestion if companyBackground is not empty
        if (gig[nextSectionId] && gig[nextSectionId].trim() !== '') {
          generateSuggestion(nextSectionId);
        }
      } else {
        generateSuggestion(nextSectionId);
      }
    }
  };

  const handleBack = () => {
    const currentIndex = getSectionIndex(sectionId as SectionId);
    
    if (currentIndex === 0) {
      navigate('/guided-journey');
      reset();
    } else {
      const prevSectionId = guidedJourneyOrder[currentIndex - 1];
      setActiveSection(prevSectionId);
      navigate(`/guided-journey/${prevSectionId}`);
      setError(null);
    }
  };
  
  // Get the current section info
  const currentSectionMetadata = sectionId ? sectionMetadata[sectionId as SectionId] : null;
  if (!currentSectionMetadata) return null;
  
  // Calculate progress percentage
  const progress = ((getSectionIndex(sectionId as SectionId) + 1) / guidedJourneyOrder.length) * 100;
  
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="container mx-auto max-w-3xl py-16 px-4">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Step {getSectionIndex(sectionId as SectionId) + 1} of {guidedJourneyOrder.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-semibold">{currentSectionMetadata.title}</h2>
              <button
                className="group relative"
                title={currentSectionMetadata.description}
              >
                <HelpCircle className="w-5 h-5 text-gray-400" />
                <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded shadow-lg z-10">
                  {currentSectionMetadata.description}
                  {currentSectionMetadata.example && (
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <span className="font-semibold">Example:</span>
                      <p className="text-gray-300 text-xs mt-1 whitespace-pre-line">{currentSectionMetadata.example}</p>
                    </div>
                  )}
                </div>
              </button>
              <button
                onClick={() => generateSuggestion(sectionId)}
                className={`group relative p-1.5 rounded-full ${
                  loading || !!suggestion
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-500 hover:bg-blue-50 hover:text-blue-600'
                } transition-colors ml-auto`}
                disabled={loading || !!suggestion}
              >
                <Sparkles size={16} />
                <span className="absolute right-0 -bottom-8 whitespace-nowrap text-sm bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  {!!suggestion ? 'Please resolve the current suggestion first' : 'Improve with AI'}
                </span>
              </button>
            </div>

            <div className="mb-6">
              <textarea
                ref={textareaRef}
                value={gig[sectionId as keyof Gig] || ''}
                onChange={(e) => setContent(e.target.value)}
                // placeholder={currentSectionMetadata.placeholder}
                className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  loading || !!suggestion ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                disabled={loading || !!suggestion}
                style={{ overflow: 'hidden' }}
              />
            </div>
            <div className="mb-6">
              <AIAssistant />
            </div>

            {error && (
              <p className="text-red-500 mb-4">{error}</p>
            )}

            <div className="flex justify-between gap-4">
              <button
                onClick={handleBack}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
              >
                <ArrowLeft size={20} />
                Back
              </button>
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {getSectionIndex(sectionId as SectionId) === guidedJourneyOrder.length - 1 ? 'Finish' : 'Next'}
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionGuidedJourney;
