import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Upload } from 'lucide-react';
import Header from '../components/Header';
import apiService from '../services/apiService';
import { guidedJourneyOrder } from '../data/SectionMetadata';
import { useGigOperations } from '../contexts/GigContext';

const InitialGuidedJourney: React.FC = () => {
  const [description, setDescription] = useState('');
  const [processLoading, setProcessLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  // Use GigContext operations
  const {
    setContent,
    setActiveSection,
    generateSuggestion,
    reset
  } = useGigOperations();

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    setProcessLoading(true);
    setError(null);

    try {
      const gigData = await apiService.convertTextToGig(description);
      
      // Update each field of the gig data
      Object.entries(gigData).forEach(([key, value]) => {
        if (typeof value === 'string') {
          setContent(value);
          setActiveSection(key as any);
        }
      });
      
      // Set active section to the first section
      const firstSection = guidedJourneyOrder[0];
      setActiveSection(firstSection);
      
      // Navigate to the first section
      navigate(`/guided-journey/${firstSection}`);
      
      // Generate initial suggestions for the first section
      generateSuggestion(firstSection);
    } catch (err) {
      setError('Failed to process the description. Please try again.');
    } finally {
      setProcessLoading(false);
    }
  };

  const handleFileUpload = () => {
    alert('File upload is not implemented yet');
  };

  // Reset context when entering initial step
  React.useEffect(() => {
    reset();
  }, []);

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
                  disabled={processLoading}
                />
                {processLoading && (
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
                  disabled={processLoading || !description.trim()}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors text-lg font-medium"
                >
                  {processLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      Processing...
                    </span>
                  ) : (
                    'Continue'
                  )}
                </button>
                <button
                  onClick={handleFileUpload}
                  disabled={processLoading}
                  className="flex items-center justify-center gap-2 border border-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <Upload size={20} />
                  Upload a file
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InitialGuidedJourney;
