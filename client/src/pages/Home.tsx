import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Upload } from 'lucide-react';
import Header from '../components/Header';
import apiService from '../services/apiService';

const Home: React.FC = () => {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load saved draft if exists
  useEffect(() => {
    const savedDraft = localStorage.getItem('gigDescriptionDraft');
    if (savedDraft) {
      setDescription(savedDraft);
    }
  }, []);

  // Save draft as user types
  useEffect(() => {
    if (description) {
      localStorage.setItem('gigDescriptionDraft', description);
    }
  }, [description]);

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const gigDescription = await apiService.convertTextToGig(description);
      navigate('/gig-builder', { state: { gigDescription } });
    } catch (err) {
      setError('Failed to process the description. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const extractedText = await apiService.extractTextFromFile(formData);
      setDescription(extractedText);
    } catch (err) {
      setError('Failed to process file. Please try again or paste the content directly.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="container mx-auto max-w-3xl py-16 px-4">
        <h1 className="text-3xl font-bold text-center mb-4">
          Create Your Gig Description
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Describe your gig in plain English — who you're hiring, what they'll do, and what you're looking for.
          We'll help turn your rough notes into a polished job description.
        </p>

        <div className="flex flex-col gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="relative mb-4">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your gig in detail. For example:&#10;- What services do you offer?&#10;- What is your experience level?&#10;- What makes your service unique?&#10;&#10;Please provide as much information as possible."
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
                  'Create Gig'
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

          <div className="text-center">
            <span className="text-gray-500">or</span>
          </div>

          <button
            onClick={() => navigate('/gig-builder')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 border border-gray-200"
          >
            Start with Blank Gig Builder
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
