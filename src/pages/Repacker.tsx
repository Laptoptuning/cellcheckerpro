
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BatteryGrid from '@/components/BatteryGrid';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Battery } from '@/types/battery';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Package, Battery as BatteryIcon } from 'lucide-react';
import NewBatteryPackForm from '@/components/repacker/NewBatteryPackForm';

const Repacker: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  
  useEffect(() => {
    // Simulate loading for a smoother first load experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Update selected cells
  const handleCellSelection = (cellId: number, selected: boolean) => {
    setSelectedCells(prev => 
      selected 
        ? [...prev, cellId] 
        : prev.filter(id => id !== cellId)
    );
  };

  // Handler for creating a new battery pack
  const handleCreatePack = (packName: string, configuration: string) => {
    if (selectedCells.length === 0) {
      toast({
        title: "No cells selected",
        description: "Please select at least one cell to create a battery pack.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Battery pack created",
      description: `Created ${packName} with ${selectedCells.length} cells in ${configuration} configuration.`,
    });
    
    // In a real app, this would send the data to the backend
    console.log("Creating battery pack:", {
      name: packName,
      configuration: configuration,
      cells: selectedCells
    });
    
    // Reset selection after creating pack
    setSelectedCells([]);
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
              <h1 className="text-3xl font-medium mb-2">Battery Repacker</h1>
              <p className="text-neutral-400">Create new battery packs from tested and selected cells</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-neutral-800 border-neutral-700 col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-neutral-100">Cell Selection</CardTitle>
                  <CardDescription className="text-neutral-400">Select cells to include in your new battery pack</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="available" className="w-full">
                    <TabsList className="grid grid-cols-2 mb-4 bg-neutral-700">
                      <TabsTrigger value="available">Available Cells</TabsTrigger>
                      <TabsTrigger value="recommended">Recommended Groups</TabsTrigger>
                    </TabsList>
                    <TabsContent value="available" className="mt-0">
                      <BatteryGrid 
                        onSelectCell={handleCellSelection} 
                        selectedCells={selectedCells}
                      />
                    </TabsContent>
                    <TabsContent value="recommended" className="mt-0">
                      <div className="p-6 text-center text-neutral-400">
                        <RefreshCw className="mx-auto h-12 w-12 text-neutral-500 mb-3" />
                        <h3 className="text-lg font-medium text-neutral-300 mb-2">Automatic Matching</h3>
                        <p>Our algorithm can automatically group cells with similar characteristics for optimal performance.</p>
                        <Button className="mt-4">Generate Recommendations</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <Card className="bg-neutral-800 border-neutral-700">
                <CardHeader>
                  <CardTitle className="text-neutral-100">Pack Builder</CardTitle>
                  <CardDescription className="text-neutral-400">Configure your new battery pack</CardDescription>
                </CardHeader>
                <CardContent>
                  <NewBatteryPackForm 
                    selectedCellCount={selectedCells.length}
                    onCreatePack={handleCreatePack}
                  />
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-neutral-800 border-neutral-700 mb-8">
              <CardHeader>
                <CardTitle className="text-neutral-100">Recently Created Packs</CardTitle>
                <CardDescription className="text-neutral-400">
                  View and manage your recently created battery packs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 rounded-lg bg-neutral-750 border border-neutral-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Battery Pack #{i}</h3>
                          <p className="text-sm text-neutral-400">Created 2 days ago</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">12 cells</span>
                        <span className="text-neutral-400">4S3P</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Repacker;
