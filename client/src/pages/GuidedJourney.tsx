import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Upload, ArrowLeft, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import apiService from '../services/apiService';
import { formSections } from '../data/SectionMetadata';
import { GigDescription } from '../types/gig';
import { useSuggestions } from '../hooks/useSuggestions';
import AIAssistant from '../components/AIAssistant';

// Define the order of sections for the guided journey
const guidedJourneyOrder = [
  'title',
  'summary',
  'deliverables',
  'skills',
  'timeline',
  'budget',
  'companyBackground'
];

const GuidedJourney: React.FC = () => {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'initial' | number>('initial');
  const [gigData, setGigData] = useState<GigDescription>({
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
    notes: '',
  });
  const navigate = useNavigate();

  // Get required sections in the specified order
  const requiredSections = guidedJourneyOrder.map(id => 
    formSections.find(section => section.id === id)!
  );

  // Use suggestions hook
  const {
    loading: suggestionLoading,
    suggestionData,
    hasActiveSuggestion,
    generateSuggestion,
    handleAcceptSuggestion: handleAcceptSuggestionBase,
    handleEnhanceSuggestion,
    handleDismissSuggestion
  } = useSuggestions();

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const gigDescription = await apiService.convertTextToGig(description);
      setGigData(gigDescription);
      setCurrentStep(0); // Move to first section
      
      // Generate initial suggestions for the first section
      const currentSection = requiredSections[0];
      generateSuggestion(currentSection.id, gigDescription[currentSection.id], gigDescription);
    } catch (err) {
      setError('Failed to process the description. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = () => {
    alert('File upload is not implemented yet');
  };

  const handleSectionUpdate = (value: string) => {
    const currentSection = requiredSections[currentStep as number];
    setGigData(prev => ({
      ...prev,
      [currentSection.id]: value
    }));
  };

  const handleAcceptSuggestion = (value: string) => {
    handleAcceptSuggestionBase(value, (section, value) => {
      const currentSection = requiredSections[currentStep as number];
      setGigData(prev => ({
        ...prev,
        [currentSection.id]: value
      }));
    });
  };

  const handleNext = () => {
    const currentSection = requiredSections[currentStep as number];
    if (!gigData[currentSection.id as keyof GigDescription]?.trim()) {
      setError(`Please complete the ${currentSection.title} section`);
      return;
    }

    if (currentStep === requiredSections.length - 1) {
      // If this is the last section, navigate to content
      navigate('/content', { state: { gigDescription: gigData } });
    } else {
      const nextStep = (currentStep as number) + 1;
      setCurrentStep(nextStep);
      setError(null);
      
      // Generate suggestions for the next section
      const nextSection = requiredSections[nextStep];
      if (nextSection.id === 'companyBackground') {
        // Only generate suggestion if companyBackground is not empty
        if (gigData[nextSection.id] && gigData[nextSection.id].trim() !== '') {
          generateSuggestion(nextSection.id, gigData[nextSection.id], gigData);
        }
      } else {
        generateSuggestion(nextSection.id, gigData[nextSection.id], gigData);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      setCurrentStep('initial');
    } else {
      setCurrentStep((currentStep as number) - 1);
    }
    setError(null);
  };

  // Render initial description input
  if (currentStep === 'initial') {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <div className="container mx-auto max-w-3xl py-16 px-4">
            <h1 className="text-3xl font-bold text-center mb-4">
              Describe Your Gig
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Start by providing a rough description of your gig. We'll help organize it into sections later.
            </p>
            <div className="flex flex-col gap-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="relative mb-4">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your gig in plain English — The outcomes you want, activities that you will want a provider to do, and such. Or upload a file if you already have something written. We'll help turn your rough notes into a polished job description."
                    className="w-full h-64 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                      <Loader2 className="animate-spin text-blue-600" />
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-red-500 mb-4">{error}</p>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !description.trim()}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors text-lg font-medium"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        Processing...
                      </span>
                    ) : (
                      'Continue'
                    )}
                  </button>

                  <label className="flex items-center justify-center gap-2 cursor-pointer py-3 px-6 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <Upload size={20} />
                    <span>Upload File</span>
                    <input
                      type="file"
                      hidden
                      accept=".txt,.doc,.docx,.pdf"
                      onChange={handleFileUpload}
                      disabled={isLoading}
                    />
                  </label>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  Supported file types: .txt, .doc, .docx, .pdf
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Render section-by-section flow
  const currentSection = requiredSections[currentStep as number];
  const progress = ((currentStep as number) + 1) / requiredSections.length * 100;

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
              Step {(currentStep as number) + 1} of {requiredSections.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-semibold">{currentSection.title}</h2>
              <button
                className="group relative"
                title={currentSection.description}
              >
                <HelpCircle className="w-5 h-5 text-gray-400" />
                <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-sm rounded shadow-lg z-10">
                  {currentSection.description}
                  {currentSection.example && (
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <span className="font-semibold">Example:</span>
                      <p className="text-gray-300 text-xs mt-1 whitespace-pre-line">{currentSection.example}</p>
                    </div>
                  )}
                </div>
              </button>
              <button
                onClick={() => generateSuggestion(currentSection.id, gigData[currentSection.id], gigData)}
                className={`group relative p-1.5 rounded-full ${
                  hasActiveSuggestion
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-500 hover:bg-blue-50 hover:text-blue-600'
                } transition-colors ml-auto`}
                disabled={hasActiveSuggestion}
              >
                <Sparkles size={16} />
                <span className="absolute right-0 -bottom-8 whitespace-nowrap text-sm bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  {hasActiveSuggestion ? 'Please resolve the current suggestion first' : 'Improve with AI'}
                </span>
              </button>
            </div>

            <div className="mb-6">
              <textarea
                value={gigData[currentSection.id as keyof GigDescription]}
                onChange={(e) => handleSectionUpdate(e.target.value)}
                placeholder={currentSection.placeholder}
                className={`w-full h-40 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  hasActiveSuggestion ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                disabled={hasActiveSuggestion}
              />
            </div>

            {/* AI Assistant */}
            {(suggestionLoading || suggestionData) && (
              <div className="mb-6">
                <AIAssistant
                  loading={suggestionLoading}
                  suggestion={suggestionData[currentSection.id]}
                  handleAcceptSuggestion={handleAcceptSuggestion}
                  handleDismissSuggestion={handleDismissSuggestion}
                  handleEnhanceSuggestion={() => handleEnhanceSuggestion(currentSection.id, gigData[currentSection.id], gigData)}
                />
              </div>
            )}

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
                {currentStep === requiredSections.length - 1 ? 'Finish' : 'Next'}
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuidedJourney;