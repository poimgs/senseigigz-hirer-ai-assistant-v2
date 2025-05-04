import { useEffect } from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';
import { useGigOperations } from '../contexts/GigContext';
import AIAssistant from './AIAssistant';

const Section = () => {
  const {
    gig,
    metadata,
    suggestion,
    loading,
    activeSection,
    setContent,
    generateSuggestion
  } = useGigOperations();

  if (!activeSection) return null;

  useEffect(() => {
    if (activeSection && gig[activeSection]) {
      const textarea = document.getElementById(activeSection || '') as HTMLTextAreaElement;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight + 4}px`;
    }
  }, [activeSection]);
  return (
    <div
      key={activeSection}
      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 max-w-full`}
      data-section={activeSection}
    >
      <div className="relative">        
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2 flex-grow">
            <button
              className="group relative ml-1"
            >
              <HelpCircle className="w-4 h-4 text-gray-400" />
              <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-sm text-left rounded shadow-lg">
                {metadata?.description}
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <span className="font-semibold">Example:</span>
                  <p className="text-gray-300 text-xs mt-1">{metadata?.example}</p>
                </div>
              </div>
            </button>
          </div>
          <div className={`flex items-center gap-2`}>
            <button
              onClick={() => generateSuggestion(activeSection)}
              className={`group relative p-1.5 rounded-full ${
                suggestion || loading
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-500 hover:bg-blue-50 hover:text-blue-600'
              } transition-colors`}
              disabled={!!(suggestion || loading)}
            >
              <Sparkles size={16} />
              <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 whitespace-nowrap text-sm bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {suggestion || loading ? 'Please resolve the current suggestion first' : 'Suggest'}
              </span>
            </button>
          </div>
        </div>
        <>
          <div className="relative">
            <textarea
              id={activeSection || ''}
              value={gig[activeSection]}
              onChange={(e) => {
                const target = e.target;
                // Auto adjust height on user input
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight + 4}px`;
                setContent(target.value);
              }}
              placeholder={metadata?.placeholder}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[100px] whitespace-pre-wrap break-words ${
                suggestion ? 'bg-gray-100 text-gray-500' : ''
              }`}
              disabled={!!suggestion}
            />
          </div>
          
          {(loading || suggestion) && activeSection === activeSection && (
            <div className="mt-4">
              <AIAssistant />
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default Section;
