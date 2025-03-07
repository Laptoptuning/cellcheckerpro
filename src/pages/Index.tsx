
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { TestType } from '@/types/battery';
import { toast } from '@/components/ui/use-toast';
import LoadingState from '@/components/dashboard/LoadingState';
import TestControls from '@/components/dashboard/TestControls';
import CellStatusOverview from '@/components/dashboard/CellStatusOverview';

const Index: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [testInProgress, setTestInProgress] = useState(false);
  const [currentTest, setCurrentTest] = useState<TestType | null>(null);
  
  useEffect(() => {
    // Simulate loading for a smoother first load experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handler for starting a test
  const handleStartTest = (testType: TestType) => {
    if (selectedCells.length === 0) {
      toast({
        title: "No cells selected",
        description: "Please select at least one cell to start the test.",
        variant: "destructive"
      });
      return;
    }

    setTestInProgress(true);
    setCurrentTest(testType);
    
    toast({
      title: "Test started",
      description: `Starting ${testType} test for ${selectedCells.length} selected cells.`,
    });
  };

  // Handler for stopping a test
  const handleStopTest = () => {
    setTestInProgress(false);
    setCurrentTest(null);
    
    toast({
      title: "Test stopped",
      description: "The current test has been stopped.",
    });
  };

  // Handler for disposing cells
  const handleDisposeCells = () => {
    if (selectedCells.length === 0) {
      toast({
        title: "No cells selected",
        description: "Please select at least one cell to dispose.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Cells marked for disposal",
      description: `${selectedCells.length} cells marked for disposal.`,
    });
    
    // In a real app, this would update the cell status in the database
    setSelectedCells([]);
  };

  // Update selected cells
  const handleCellSelection = (cellId: number, selected: boolean) => {
    setSelectedCells(prev => 
      selected 
        ? [...prev, cellId] 
        : prev.filter(id => id !== cellId)
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-neutral-100">
      <Navbar />
      
      <main className="flex-1 pt-24 px-4 container mx-auto">
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            <div className="mb-8 animate-fade-in">
              <h1 className="text-3xl font-medium mb-2">Ultimate Cell Tester</h1>
              <p className="text-neutral-400">Monitor and control your 18650 Li-ion cells in real-time</p>
            </div>
            
            <TestControls 
              selectedCells={selectedCells}
              testInProgress={testInProgress}
              currentTest={currentTest}
              onStartTest={handleStartTest}
              onStopTest={handleStopTest}
              onDisposeCells={handleDisposeCells}
            />
            
            <div className="grid grid-cols-1 gap-8 mb-8">
              <CellStatusOverview 
                selectedCells={selectedCells}
                onSelectCell={handleCellSelection}
              />
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
