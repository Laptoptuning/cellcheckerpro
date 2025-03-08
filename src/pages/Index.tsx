
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { TestType } from '@/types/battery';
import { toast } from '@/components/ui/use-toast';
import LoadingState from '@/components/dashboard/LoadingState';
import TestControls from '@/components/dashboard/TestControls';
import CellStatusOverview from '@/components/dashboard/CellStatusOverview';
import { saveBattery } from '@/services/batteryStorage';
import { startTest, stopTest, disposeCells } from '@/services/apiService';

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
  const handleStartTest = async (testType: TestType) => {
    if (selectedCells.length === 0) {
      toast({
        title: "No cells selected",
        description: "Please select at least one cell to start the test.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Send request to start test via API
      const success = await startTest(selectedCells, testType);
      
      if (success) {
        setTestInProgress(true);
        setCurrentTest(testType);
        
        // Update local state for UI
        selectedCells.forEach(cellId => {
          saveBattery({
            id: cellId,
            isUnderTest: true,
            currentTest: testType,
            lastUpdated: new Date()
          } as any);
        });
        
        toast({
          title: "Test started",
          description: `Starting ${testType} test for ${selectedCells.length} selected cells.`,
        });
      } else {
        throw new Error("Failed to start test");
      }
    } catch (error) {
      console.error("Error starting test:", error);
      toast({
        title: "Error",
        description: "Failed to start test. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handler for stopping a test
  const handleStopTest = async () => {
    try {
      // Send request to stop test via API
      const success = await stopTest(selectedCells);
      
      if (success) {
        setTestInProgress(false);
        setCurrentTest(null);
        
        // Update local state for UI
        selectedCells.forEach(cellId => {
          saveBattery({
            id: cellId,
            isUnderTest: false,
            currentTest: undefined,
            lastUpdated: new Date()
          } as any);
        });
        
        toast({
          title: "Test stopped",
          description: "The current test has been stopped.",
        });
      } else {
        throw new Error("Failed to stop test");
      }
    } catch (error) {
      console.error("Error stopping test:", error);
      toast({
        title: "Error",
        description: "Failed to stop test. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handler for disposing cells
  const handleDisposeCells = async () => {
    if (selectedCells.length === 0) {
      toast({
        title: "No cells selected",
        description: "Please select at least one cell to dispose.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Send request to dispose cells via API
      const success = await disposeCells(selectedCells);
      
      if (success) {
        // Update local state for UI
        selectedCells.forEach(cellId => {
          saveBattery({
            id: cellId,
            status: 'danger',
            disposed: true,
            lastUpdated: new Date()
          } as any);
        });
        
        toast({
          title: "Cells marked for disposal",
          description: `${selectedCells.length} cells marked for disposal.`,
        });
        
        setSelectedCells([]);
      } else {
        throw new Error("Failed to dispose cells");
      }
    } catch (error) {
      console.error("Error disposing cells:", error);
      toast({
        title: "Error",
        description: "Failed to mark cells for disposal. Please try again.",
        variant: "destructive"
      });
    }
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
