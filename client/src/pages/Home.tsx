import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Upload, PenLine, Wand2 } from 'lucide-react';
import Header from '../components/Header';
import apiService from '../services/apiService';

const Home: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      // TODO: Implement file upload logic
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) {
      setError('Please enter a description');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const gigDescription = await apiService.convertTextToGig(textInput);
      // Navigate to gig builder with the structured gig description
      navigate('/gig-builder', { state: { gigDescription } });
    } catch (err) {
      setError('Failed to process the description. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startChat = () => {
    alert('Chat functionality is not implemented yet.');
    // navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <Header />
      <div className="container mx-auto max-w-3xl py-16">
        <h1 className="text-3xl font-bold text-center mb-4">
          Create Your Gig Description
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Choose how you want to begin creating your own gig description
        </p>

        {showTextInput ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Enter Your Description</h2>
              <button
                onClick={() => setShowTextInput(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
            </div>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter your gig description here..."
              className="w-full h-64 p-4 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            {error && (
              <p className="text-red-500 mb-4">{error}</p>
            )}
            <button
              onClick={handleTextSubmit}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isLoading ? 'Processing...' : 'Continue'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div
              className="p-6 rounded-lg shadow-lg bg-gradient-to-br from-purple-50 to-white flex flex-col items-center cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-purple-100"
              onClick={startChat}
            >
              <div className="bg-purple-100 p-3 rounded-full mb-4">
                <MessageSquare size={48} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-purple-800">
                Start a Chat
              </h2>
              <p className="text-gray-700 text-center">
                Let's talk about your gig and I'll help you create the perfect description
              </p>
              <span className="mt-4 text-purple-600 font-medium">Chat Now →</span>
            </div>

            <div
              className="p-6 rounded-lg shadow-lg bg-gradient-to-br from-green-50 to-white flex flex-col items-center cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-green-100"
              onClick={() => setShowTextInput(true)}
            >
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <PenLine size={48} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-green-800">
                Enter Text
              </h2>
              <p className="text-gray-700 text-center">
                Paste or type your gig description and I'll help structure it
              </p>
              <span className="mt-4 text-green-600 font-medium">Start Writing →</span>
            </div>

            <label className="p-6 rounded-lg shadow-lg bg-gradient-to-br from-amber-50 to-white flex flex-col items-center cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-amber-100">
              <input
                type="file"
                hidden
                accept=".txt,.doc,.docx,.pdf"
                onChange={handleFileUpload}
              />
              <div className="bg-amber-100 p-3 rounded-full mb-4">
                <Upload size={48} className="text-amber-600" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-amber-800">
                Upload Description
              </h2>
              <p className="text-gray-700 text-center">
                Upload an existing job or gig description file
              </p>
              <span className="mt-4 text-amber-600 font-medium">Choose File →</span>
              {file && (
                <p className="mt-2 text-sm text-amber-600">
                  Selected: {file.name}
                </p>
              )}
            </label>

            <div
              className="p-6 rounded-lg shadow-lg bg-gradient-to-br from-blue-50 to-white flex flex-col items-center cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-blue-100"
              onClick={() => navigate('/gig-builder')}
            >
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Wand2 size={48} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-blue-800">
                Gig Builder
              </h2>
              <p className="text-gray-700 text-center">
                Start creating your gig directly in our interactive builder
              </p>
              <span className="mt-4 text-blue-600 font-medium">Get Started →</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
