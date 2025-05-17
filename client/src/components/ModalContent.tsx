import { useEffect, useRef, useState } from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';
import { useGigOperations } from '../contexts/GigContext';
import AIAssistant from './AIAssistant';

const ModalContent = () => {
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

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const tooltipButtonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (activeSection && gig[activeSection] && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [activeSection, gig]);

  // Handle tooltip positioning
  useEffect(() => {
    const updateTooltipPosition = () => {
      if (tooltipButtonRef.current && tooltipRef.current) {
        const rect = tooltipButtonRef.current.getBoundingClientRect();
        tooltipRef.current.style.setProperty('--tooltip-x', `${rect.left + rect.width / 2}px`);
        tooltipRef.current.style.setProperty('--tooltip-y', `${rect.top}px`);
      }
    };
    
    // Update position on mount and window resize
    updateTooltipPosition();
    window.addEventListener('resize', updateTooltipPosition);
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', updateTooltipPosition);
    };
  }, []);
  return (
    <div
      key={activeSection}
      className="bg-white p-2 rounded-lg shadow-md max-w-full"
      data-section={activeSection}
    >
      <div className="relative">        
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-2xl font-semibold">{metadata?.title}</h2>
          <button
            className="group relative"
            title={metadata?.description}
            ref={tooltipButtonRef}
          >
            <HelpCircle className="w-5 h-5 text-gray-400" />
            <div 
              ref={tooltipRef}
              className="hidden group-hover:block fixed w-64 p-2 bg-gray-800 text-white text-sm text-left rounded shadow-lg z-50 transform -translate-x-1/2 -translate-y-full group-hover:opacity-100 transition-opacity duration-200"
                style={{
                  left: 'var(--tooltip-x, 50%)',
                  top: 'var(--tooltip-y, 0)',
                  marginBottom: '10px'
                }}
            >
              {metadata?.description}
              {metadata?.example && (
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <span className="font-semibold">Example:</span>
                  <p className="text-gray-300 text-xs mt-1 whitespace-pre-line">{metadata?.example}</p>
                </div>
              )}
            </div>
          </button>
          <button
            onClick={() => generateSuggestion(activeSection)}
            className={`group relative p-1.5 rounded-full ${
              loading || suggestion
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-500 hover:bg-blue-50 hover:text-blue-600'
            } transition-colors ml-auto`}
            disabled={!!(loading || suggestion)}
          >
            <Sparkles size={16} />
            <span className="absolute right-0 -bottom-8 whitespace-nowrap text-sm bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {!!suggestion ? 'Please resolve the current suggestion first' : 'Improve with AI'}
            </span>
          </button>
        </div>
        <>
          <div>
            <textarea
              ref={textareaRef}
              value={gig[activeSection] || ''}
              onChange={(e) => {
                const target = e.target;
                // Auto adjust height on user input
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
                setContent(target.value);
              }}
              placeholder={loading ? 'Generating...' : suggestion ? '' : metadata?.placeholder}
              className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[100px] ${
                loading || !!suggestion ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              disabled={loading || !!suggestion}
              style={{ overflow: 'hidden' }}
            />
          </div>
          <div>
            {(loading || suggestion) && (
              <AIAssistant />
            )}
          </div>
        </>
      </div>
    </div>
  );
};

export default ModalContent;
