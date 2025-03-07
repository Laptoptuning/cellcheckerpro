
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BatteryGrid from '@/components/BatteryGrid';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Battery, TestType } from '@/types/battery';
import { toast } from '@/components/ui/use-toast';
import { Battery as BatteryIcon, Play, Pause, TestTube, Trash, Power, Zap, MoveDown, FlaskConical } from 'lucide-react';

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
          <div className="min-h-[70vh] flex flex-col items-center justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-neutral-700"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin-slow"></div>
            </div>
            <p className="mt-4 text-neutral-400 animate-pulse-smooth">Loading battery data...</p>
          </div>
        ) : (
          <>
            <div className="mb-8 animate-fade-in">
              <h1 className="text-3xl font-medium mb-2">Ultimate Cell Tester</h1>
              <p className="text-neutral-400">Monitor and control your 18650 Li-ion cells in real-time</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-neutral-800 border-neutral-700 col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-neutral-100">Test Controls</CardTitle>
                  <CardDescription className="text-neutral-400">Start or stop tests for selected cells</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2 h-20 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 border-neutral-600"
                      onClick={() => handleStartTest('charge')}
                      disabled={testInProgress}
                    >
                      <Zap className="h-5 w-5 text-success-400" />
                      <div className="flex flex-col items-start">
                        <span>Start Charging</span>
                        <span className="text-xs text-neutral-400">Charge to 4.2V</span>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2 h-20 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 border-neutral-600"
                      onClick={() => handleStartTest('discharge')}
                      disabled={testInProgress}
                    >
                      <MoveDown className="h-5 w-5 text-warning-400" />
                      <div className="flex flex-col items-start">
                        <span>Start Discharging</span>
                        <span className="text-xs text-neutral-400">Discharge to 2.8V</span>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2 h-20 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 border-neutral-600"
                      onClick={() => handleStartTest('esr')}
                      disabled={testInProgress}
                    >
                      <TestTube className="h-5 w-5 text-primary" />
                      <div className="flex flex-col items-start">
                        <span>Measure ESR</span>
                        <span className="text-xs text-neutral-400">Internal resistance</span>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2 h-20 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 border-neutral-600"
                      onClick={() => handleStartTest('capacity')}
                      disabled={testInProgress}
                    >
                      <FlaskConical className="h-5 w-5 text-warning-500" />
                      <div className="flex flex-col items-start">
                        <span>Measure Capacity</span>
                        <span className="text-xs text-neutral-400">Full cycle test</span>
                      </div>
                    </Button>
                  </div>
                  
                  <div className="mt-6 flex justify-between items-center">
                    <Button 
                      variant="destructive" 
                      className="flex items-center gap-2"
                      onClick={handleDisposeCells}
                      disabled={testInProgress || selectedCells.length === 0}
                    >
                      <Trash className="h-4 w-4" />
                      <span>Dispose Cells</span>
                    </Button>
                    
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 border-neutral-600"
                        onClick={() => handleStartTest('store')}
                        disabled={testInProgress || selectedCells.length === 0}
                      >
                        <BatteryIcon className="h-4 w-4 text-success-400" />
                        <span>Store (3.4V)</span>
                      </Button>
                      
                      {testInProgress ? (
                        <Button 
                          variant="default" 
                          className="bg-danger-500 hover:bg-danger-600 flex items-center gap-2"
                          onClick={handleStopTest}
                        >
                          <Pause className="h-4 w-4" />
                          <span>Stop Test</span>
                        </Button>
                      ) : (
                        <Button 
                          variant="default" 
                          className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                          onClick={() => handleStartTest('macro')}
                          disabled={selectedCells.length === 0}
                        >
                          <Play className="h-4 w-4" />
                          <span>Start Macro</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-neutral-800 border-neutral-700">
                <CardHeader>
                  <CardTitle className="text-neutral-100">Status</CardTitle>
                  <CardDescription className="text-neutral-400">Current test progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-neutral-400 mb-1">Test Type:</p>
                      <p className="text-lg font-medium">
                        {currentTest ? currentTest.charAt(0).toUpperCase() + currentTest.slice(1) : 'None'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-neutral-400 mb-1">Cells Selected:</p>
                      <p className="text-lg font-medium">{selectedCells.length}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-neutral-400 mb-1">Status:</p>
                      <div className="flex items-center gap-2">
                        {testInProgress ? (
                          <>
                            <span className="h-2 w-2 bg-success-500 rounded-full animate-pulse"></span>
                            <p className="text-success-500">Running</p>
                          </>
                        ) : (
                          <>
                            <span className="h-2 w-2 bg-neutral-500 rounded-full"></span>
                            <p className="text-neutral-400">Idle</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 gap-8 mb-8">
              <Card className="bg-neutral-800 border-neutral-700">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-neutral-100">Cell Status Overview</CardTitle>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-success-500 mr-1"></span>
                        <span className="text-neutral-300">Good</span>
                      </span>
                      <span className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-warning-500 mr-1"></span>
                        <span className="text-neutral-300">Warning</span>
                      </span>
                      <span className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-danger-500 mr-1"></span>
                        <span className="text-neutral-300">Critical</span>
                      </span>
                    </div>
                  </div>
                  <CardDescription className="text-neutral-400">
                    {selectedCells.length > 0 
                      ? `${selectedCells.length} cells selected` 
                      : 'Click on cells to select them for testing'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BatteryGrid 
                    onSelectCell={handleCellSelection} 
                    selectedCells={selectedCells}
                  />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
