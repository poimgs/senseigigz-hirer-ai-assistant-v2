import React, { useState } from 'react';
import { Download, Copy, Share2, FileText, History, Check, X } from 'lucide-react';

interface PreviewProps {
  jobDescription: {
    title: string;
    summary: string;
    companyBackground: string;
    deliverables: string;
    responsibilities: string;
    successCriteria: string;
    skills: string;
    budget: string;
    timeline: string;
    communication: string;
    ownership: string;
    confidentiality: string;
    notes: string;
  };
  history: Array<typeof jobDescription>;
  setJobDescription: React.Dispatch<React.SetStateAction<typeof jobDescription>>;
  onClose: () => void;
}

const Preview: React.FC<PreviewProps> = ({ jobDescription, history, setJobDescription, onClose }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [formatType, setFormatType] = useState<'standard' | 'minimal' | 'detailed'>('standard');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const text = document.getElementById('preview-content')?.innerText;
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const downloadAsText = () => {
    const text = document.getElementById('preview-content')?.innerText;
    if (text) {
      const element = document.createElement('a');
      const file = new Blob([text], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `Job Description - ${jobDescription.title || 'Untitled'}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const restoreVersion = (version: typeof jobDescription) => {
    setJobDescription(version);
    setShowHistory(false);
  };

  const renderSection = (title: string, content: string) => {
    if (!content && formatType === 'minimal') return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <div className="whitespace-pre-wrap">{content || 'Not specified'}</div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Preview Job Description</h2>
        
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          <button 
            onClick={() => setFormatType('minimal')}
            className={`px-3 py-1 text-sm ${formatType === 'minimal' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
          >
            Minimal
          </button>
          <button 
            onClick={() => setFormatType('standard')}
            className={`px-3 py-1 text-sm ${formatType === 'standard' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
          >
            Standard
          </button>
          <button 
            onClick={() => setFormatType('detailed')}
            className={`px-3 py-1 text-sm ${formatType === 'detailed' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
          >
            Detailed
          </button>
        </div>
        
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center text-sm bg-white border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-50"
        >
          <History size={16} className="mr-1" />
          History
        </button>
      </div>
      
      <div>
        {showHistory ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Version History</h3>
            
            {history.length === 0 ? (
              <p className="text-gray-500">No previous versions available yet.</p>
            ) : (
              <div className="space-y-4">
                {history.map((version, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{version.title || 'Untitled'}</span>
                        <p className="text-sm text-gray-500 mt-1">Version {history.length - index}</p>
                      </div>
                      <button 
                        onClick={() => restoreVersion(version)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold text-gray-900">{jobDescription.title || 'Untitled Job Description'}</h1>
              
              <div className="flex space-x-2">
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center text-sm bg-white border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-50"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="mr-1 text-green-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="mr-1" />
                      Copy
                    </>
                  )}
                </button>
                <button 
                  onClick={downloadAsText}
                  className="flex items-center text-sm bg-white border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-50"
                >
                  <Download size={16} className="mr-1" />
                  Download
                </button>
                <button className="flex items-center text-sm bg-blue-500 text-white rounded-md px-3 py-1 hover:bg-blue-600">
                  <Share2 size={16} className="mr-1" />
                  Share
                </button>
              </div>
            </div>
            
            <div id="preview-content" className="text-gray-700">
              {formatType === 'detailed' && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <h3 className="font-semibold text-blue-800">About This Job Description</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    This comprehensive job description is designed for a freelance project. It includes all necessary information for contractors to understand the scope, requirements, and terms of the engagement.
                  </p>
                </div>
              )}
              
              {jobDescription.summary && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Project Summary</h3>
                  <div className="whitespace-pre-wrap">{jobDescription.summary}</div>
                </div>
              )}
              
              {renderSection('Company Background', jobDescription.companyBackground)}
              {renderSection('Deliverables', jobDescription.deliverables)}
              {renderSection('Key Responsibilities', jobDescription.responsibilities)}
              {renderSection('Success Criteria', jobDescription.successCriteria)}
              {renderSection('Required Skills and Qualifications', jobDescription.skills)}
              {renderSection('Budget and Payment Terms', jobDescription.budget)}
              {renderSection('Timeline and Milestones', jobDescription.timeline)}
              {renderSection('Communication and Collaboration', jobDescription.communication)}
              {renderSection('Ownership and Intellectual Property', jobDescription.ownership)}
              
              {(jobDescription.confidentiality || formatType === 'detailed') && 
                renderSection('Confidentiality and NDA Requirements', jobDescription.confidentiality)}
              
              {(jobDescription.notes || formatType === 'detailed') && 
                renderSection('Additional Notes', jobDescription.notes)}
              
              {formatType === 'detailed' && (
                <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
                  <p>Created with Gig Description Builder</p>
                  <p className="mt-1">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;