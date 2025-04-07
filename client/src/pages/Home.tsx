import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Edit2, Upload } from 'lucide-react';
import Header from '../components/Header';
import apiService from '../services/apiService';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGuidedPath = () => {
    navigate('/guided-journey');
  };

  const handleDirectPath = () => {
    navigate('/content');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      const extractedText = await apiService.extractTextFromFile(formData);
      navigate('/content', { state: { initialText: extractedText } });
    } catch (err) {
      console.error('Failed to process file:', err);
      // You might want to show an error toast here
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Create Your Gig Description</h1>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Guided Journey Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={handleGuidedPath}>
            <div className="flex flex-col items-center text-center">
              <ClipboardList className="w-16 h-16 text-blue-600 mb-4" />
              <h2 className="text-xl font-semibold mb-3">Guided Journey</h2>
              <p className="text-gray-600 mb-4">
                Let us help you create the perfect gig description with our step-by-step guidance.
                Ideal for first-time users.
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                Start Guided Journey
              </button>
            </div>
          </div>

          {/* Direct Editor Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center text-center">
              <Edit2 className="w-16 h-16 text-green-600 mb-4" />
              <h2 className="text-xl font-semibold mb-3">Direct Editor</h2>
              <p className="text-gray-600 mb-4">
                Jump straight into creating your gig description or upload an existing one.
                Perfect for experienced users.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button
                  onClick={handleDirectPath}
                  className="flex-1 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors"
                >
                  Go to Editor
                </button>
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept=".txt,.doc,.docx,.pdf"
                  onChange={handleFileUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-full transition-colors flex items-center justify-center gap-2"
                >
                  <Upload size={20} />
                  Upload File
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Supported files: .txt, .doc, .docx, .pdf
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
