
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BatteryGrid from '@/components/BatteryGrid';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Battery, TestType } from '@/types/battery';
import { toast } from '@/components/ui/use-toast';
import { Printer, PrinterCheck } from 'lucide-react';

const Labels: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  
  useEffect(() => {
    // Simulate loading for a smoother first load experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handler for printing labels
  const handlePrintLabels = () => {
    if (selectedCells.length === 0) {
      toast({
        title: "No cells selected",
        description: "Please select at least one cell to print labels.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Printing labels",
      description: `Sending ${selectedCells.length} battery labels to printer.`,
    });
    
    // In a real app, this would send the print job to a printer
    console.log("Printing labels for cell IDs:", selectedCells);
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
              <h1 className="text-3xl font-medium mb-2">Print Battery Labels</h1>
              <p className="text-neutral-400">Select cells and print detailed information labels</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-neutral-800 border-neutral-700 col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-neutral-100">Label Printing</CardTitle>
                  <CardDescription className="text-neutral-400">Select cells and print their data on labels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-4 mb-4">
                      <Button 
                        variant="default" 
                        className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                        onClick={handlePrintLabels}
                        disabled={selectedCells.length === 0}
                      >
                        <Printer className="h-4 w-4" />
                        <span>Print Labels</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 border-neutral-600"
                        onClick={handlePrintLabels}
                        disabled={selectedCells.length === 0}
                      >
                        <PrinterCheck className="h-4 w-4" />
                        <span>Preview Labels</span>
                      </Button>
                    </div>
                    
                    <div className="p-4 rounded-md bg-neutral-700 border border-neutral-600">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-success-500"></div>
                        <span className="text-sm text-neutral-200">Printer ready</span>
                      </div>
                      <p className="text-sm text-neutral-400">
                        Selected cells: {selectedCells.length} | 
                        Label size: 100mm × 50mm | 
                        Printer: Brother QL-800
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-neutral-800 border-neutral-700">
                <CardHeader>
                  <CardTitle className="text-neutral-100">Print Status</CardTitle>
                  <CardDescription className="text-neutral-400">Label printing options</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-neutral-400 mb-1">Selected Cells:</p>
                      <p className="text-lg font-medium text-neutral-100">{selectedCells.length}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-neutral-400 mb-1">Label Content:</p>
                      <ul className="text-sm text-neutral-100 ml-4 space-y-1 list-disc">
                        <li>Battery ID</li>
                        <li>Current Voltage</li>
                        <li>State of Health</li>
                        <li>Internal Resistance</li>
                        <li>Cycle Count</li>
                        <li>QR Code for tracking</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-sm text-neutral-400 mb-1">Printer Status:</p>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 bg-success-500 rounded-full"></span>
                        <p className="text-success-500">Ready</p>
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
                    <CardTitle className="text-neutral-100">Select Cells for Labels</CardTitle>
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
                      : 'Click on cells to select them for printing labels'}
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

export default Labels;
