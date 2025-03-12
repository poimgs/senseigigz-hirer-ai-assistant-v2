// TODO: Haven't quite looked at this yet
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, HelpCircle } from 'lucide-react';
import { GigDescription } from '../types/gig';
import apiService, { MessageType } from '../services/apiService';

interface ChatInterfaceProps {
  gigDescription: GigDescription;
  updateGigDescription: (section: keyof GigDescription, value: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ gigDescription, updateGigDescription }) => {
  const [messages, setMessages] = useState<MessageType[]>([
    { 
      id: 1, 
      sender: 'assistant', 
      text: "Hello! I'm your AI assistant. I can help you create a professional gig description for your freelance project. What section would you like help with?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      sender: 'user' as const,
      text: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Get filtered messages for API context (last 10 messages)
    const contextMessages = [...messages.slice(-9), userMessage];
    
    try {
      // Call the API service
      const aiResponse = await apiService.sendMessage(contextMessages, gigDescription);
      
      const assistantMessage: MessageType = {
        id: messages.length + 2,
        sender: 'assistant',
        text: aiResponse.text,
        section: aiResponse.section,
        suggestion: aiResponse.suggestion
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: MessageType = {
        id: messages.length + 2,
        sender: 'assistant',
        text: 'Sorry, I encountered an error. Please try again later.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const requestSectionImprovement = async (section: string) => {
    const sectionContent = gigDescription[section as keyof typeof gigDescription] || '';
    const userMessage = {
      id: messages.length + 1,
      sender: 'user' as const,
      text: `Can you help me improve the ${section} section?`
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      // Call the API service
      const aiResponse = await apiService.improveSection(section, sectionContent, gigDescription);
      
      const assistantMessage: MessageType = {
        id: messages.length + 2,
        sender: 'assistant',
        text: aiResponse.text,
        section: section,
        suggestion: aiResponse.suggestion
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting improvement suggestion:', error);
      const errorMessage: MessageType = {
        id: messages.length + 2,
        sender: 'assistant',
        text: 'Sorry, I encountered an error. Please try again later.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const applySuggestion = (section: string, suggestion: string) => {
    updateGigDescription(section, suggestion);
    
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        sender: 'user',
        text: 'Apply this suggestion'
      },
      {
        id: prev.length + 2,
        sender: 'assistant',
        text: `I've updated the "${section}" section with my suggestion. Is there another section you'd like help with?`
      }
    ]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-gray-50">
        <p className="text-sm text-gray-600 mt-1">
          Ask for help with specific sections or get general advice on creating an effective gig description.
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.sender === 'assistant' && (
                  <div className="flex items-center mb-1">
                    <Sparkles size={14} className="mr-1 text-blue-500" />
                    <span className="text-xs font-medium text-blue-600">AI Assistant</span>
                  </div>
                )}
                
                <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                
                {message.suggestion && (
                  <div className="mt-3 border-t border-gray-200 pt-2">
                    <div className="text-xs font-medium mb-1">
                      {message.sender === 'user' ? 'Your suggestion:' : 'Suggested content:'}
                    </div>
                    <div className="bg-white text-gray-800 p-2 rounded text-xs whitespace-pre-wrap">
                      {message.suggestion}
                    </div>
                    
                    {message.sender === 'assistant' && message.section && (
                      <button
                        onClick={() => message.section && message.suggestion && applySuggestion(message.section, message.suggestion)}
                        className="mt-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs py-1 px-2 rounded"
                      >
                        Apply this suggestion
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask for help with your job description..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md"
          >
            <Send size={18} />
          </button>
        </div>
        
        <div className="flex justify-between mt-3">
          <div className="flex space-x-1 overflow-x-auto pb-2">
            <button 
              onClick={() => requestSectionImprovement('title')}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 py-1 px-2 rounded whitespace-nowrap"
            >
              Help with job title
            </button>
            <button 
              onClick={() => requestSectionImprovement('deliverables')}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 py-1 px-2 rounded whitespace-nowrap"
            >
              Improve deliverables
            </button>
            <button 
              onClick={() => sendMessage()}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 py-1 px-2 rounded whitespace-nowrap"
            >
              Improve my description
            </button>
          </div>
          
          <button 
            onClick={() => {
              setMessages(prev => [
                ...prev,
                {
                  id: prev.length + 1,
                  sender: 'user',
                  text: 'What can you help me with?'
                }
              ]);
              sendMessage();
            }}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center whitespace-nowrap"
          >
            <HelpCircle size={12} className="mr-1" />
            Help
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;