import React from 'react';
import { Loader } from 'lucide-react';

const ProcessingIndicator = ({ state, progress = 0 }) => {
  const getStateLabel = () => {
    switch (state) {
      case 'recording':
        return 'Recording your voice...';
      case 'processing':
        return 'Processing your audio...';
      case 'generating':
        return 'Generating your plan...';
      case 'complete':
        return 'Plan ready!';
      default:
        return '';
    }
  };
  
  if (state === 'idle') return null;
  
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {state !== 'complete' ? (
        <Loader className="w-8 h-8 text-blue-500 animate-spin mb-2" />
      ) : (
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
      )}
      
      <p className="text-sm font-medium text-gray-900 mb-1">{getStateLabel()}</p>
      
      {(state === 'processing' || state === 'generating') && (
        <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5 mt-2">
          <div 
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ProcessingIndicator;