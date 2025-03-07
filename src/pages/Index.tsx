
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BatteryGrid from '@/components/BatteryGrid';

const Index: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading for a smoother first load experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 px-4 container mx-auto">
        {isLoading ? (
          <div className="min-h-[70vh] flex flex-col items-center justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-neutral-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin-slow"></div>
            </div>
            <p className="mt-4 text-neutral-500 animate-pulse-smooth">Loading battery data...</p>
          </div>
        ) : (
          <>
            <div className="mb-8 animate-fade-in">
              <h1 className="text-3xl font-medium mb-2">Battery Dashboard</h1>
              <p className="text-neutral-500">Monitor and analyze your 18650 Li-ion cells in real-time</p>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              <div className="grid grid-cols-1 gap-8">
                <section>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium">Cell Status Overview</h2>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-success-500 mr-1"></span>
                        Good
                      </span>
                      <span className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-warning-500 mr-1"></span>
                        Warning
                      </span>
                      <span className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-danger-500 mr-1"></span>
                        Critical
                      </span>
                      <button className="ml-2 px-2 py-1 border border-neutral-200 rounded-md hover:bg-neutral-100 transition-colors">
                        Refresh
                      </button>
                    </div>
                  </div>
                  
                  <BatteryGrid />
                </section>
              </div>
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
