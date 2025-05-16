import React, { useEffect } from 'react';
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
  
  // Validate sectionId
  if (!sectionId || !guidedJourneyOrder.includes(sectionId as SectionId)) {
    navigate('/guided-journey');
    return null;
  }
  
  // Use GigContext operations
  const {
    gig,
    setContent,
    setActiveSection,
    generateSuggestion,
    reset
  } = useGigOperations();

  // Sync the active section with the URL parameter
  useEffect(() => {
    if (sectionId && guidedJourneyOrder.includes(sectionId as SectionId)) {
      setActiveSection(sectionId as SectionId);
      
      // Generate suggestions for the section if needed
      if (sectionId === 'companyBackground') {
        if (gig[sectionId] && gig[sectionId].trim() !== '') {
          generateSuggestion(sectionId as SectionId);
        }
      } else {
        generateSuggestion(sectionId as SectionId);
      }
    }
  }, [sectionId, setActiveSection, generateSuggestion, gig]);

  const handleSectionUpdate = (value: string) => {
    setContent(value);
  };

  const handleNext = () => {
    const currentIndex = getSectionIndex(sectionId);
    
    if (!gig[sectionId].trim()) {
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
      // If on the first section, go back to initial screen
      navigate('/guided-journey');
      reset(); // Reset the gig state when going back to initial screen
    } else {
      // Otherwise go to the previous section
      const prevSectionId = guidedJourneyOrder[currentIndex - 1];
      navigate(`/guided-journey/${prevSectionId}`);
      setError(null);
    }
  };
  
  // Get the current section info
  const currentSection = sectionId ? sectionMetadata[sectionId as SectionId] : null;
  if (!currentSection) return null;
  
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="container mx-auto max-w-3xl py-16 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {currentSection.title}
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Section information */}
            <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
              <div className="mt-1">
                <HelpCircle size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-800 mb-1">
                  {currentSection.title}
                </h3>
                <p className="text-blue-700 text-sm">
                  {currentSection.description}
                </p>
              </div>
            </div>

            {/* Content editor */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <textarea
                value={gig[sectionId as keyof Gig] || ''}
                onChange={(e) => handleSectionUpdate(e.target.value)}
                placeholder={currentSection.placeholder}
                className="w-full h-64 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {error && (
                <p className="text-red-500 mt-4">{error}</p>
              )}
            </div>

            <AIAssistant />

            {/* Navigation buttons - mobile optimized */}
            <div className="flex justify-between mt-4 md:hidden">
              <button
                onClick={handleBack}
                className="p-3 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Progress display */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{
                    width: `${((getSectionIndex(sectionId as SectionId) + 1) / guidedJourneyOrder.length) * 100}%`
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-500">
                {getSectionIndex(sectionId as SectionId) + 1} / {guidedJourneyOrder.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionGuidedJourney;
