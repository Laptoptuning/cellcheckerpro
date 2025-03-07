
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-neutral-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin-slow"></div>
      </div>
      <p className="mt-4 text-neutral-400 animate-pulse-smooth">Loading battery data...</p>
    </div>
  );
};

export default LoadingState;
