
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { loadBatteries } from '@/services/batteryStorage';
import { Battery } from '@/types/battery';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';

const TestedCells: React.FC = () => {
  const [testedBatteries, setTestedBatteries] = useState<Battery[]>([]);
  const [filteredBatteries, setFilteredBatteries] = useState<Battery[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'good' | 'warning' | 'danger'>('all');
  
  useEffect(() => {
    // Load batteries that have been tested
    const batteries = loadBatteries();
    const tested = batteries.filter(battery => 
      battery.cycleCount > 0 || battery.isUnderTest || battery.currentTest
    );
    
    setTestedBatteries(tested);
    setFilteredBatteries(tested);
  }, []);
  
  // Apply filters when status filter changes
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredBatteries(testedBatteries);
    } else {
      setFilteredBatteries(testedBatteries.filter(battery => battery.status === statusFilter));
    }
  }, [statusFilter, testedBatteries]);
  
  // Function to export data as CSV
  const exportToCSV = () => {
    // Create CSV content
    const headers = ['ID', 'Name', 'SoC (%)', 'SoH (%)', 'Voltage (V)', 'ESR (mΩ)', 
                    'Temperature (°C)', 'Cycle Count', 'Capacity (Ah)', 'Max Voltage (V)',
                    'Min Voltage (V)', 'Store Voltage (V)', 'Status', 'Last Test Date'];
    
    const csvRows = [
      headers.join(','),
      ...filteredBatteries.map(battery => [
        battery.id,
        battery.name,
        battery.soc,
        battery.soh,
        battery.voltage,
        battery.esr,
        battery.temperature,
        battery.cycleCount,
        battery.capacityAh || 'N/A',
        battery.maxVoltage || 'N/A',
        battery.minVoltage || 'N/A',
        battery.storeVoltage || 'N/A',
        battery.status,
        new Date(battery.lastUpdated).toLocaleString()
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'tested_cells.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Helper function to get the status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-[#22c55e]';
      case 'warning': return 'bg-[#f97316]';
      case 'danger': return 'bg-[#ef4444]';
      default: return 'bg-neutral-500';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-neutral-100">
      <Navbar />
      
      <main className="flex-1 pt-24 px-4 container mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-medium mb-2">Tested Cells Overview</h1>
          <p className="text-neutral-400">Comprehensive data for all tested battery cells</p>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <Tabs defaultValue="all" className="w-[400px]" onValueChange={(value) => setStatusFilter(value as any)}>
            <TabsList className="bg-neutral-800 text-white">
              <TabsTrigger value="all" className="data-[state=active]:bg-neutral-700">All</TabsTrigger>
              <TabsTrigger value="good" className="data-[state=active]:bg-neutral-700">Good</TabsTrigger>
              <TabsTrigger value="warning" className="data-[state=active]:bg-neutral-700">Warning</TabsTrigger>
              <TabsTrigger value="danger" className="data-[state=active]:bg-neutral-700">Critical</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-3">
            <Button variant="outline" className="bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
            
            <Button onClick={exportToCSV} className="bg-primary text-white hover:bg-primary/90">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
        
        <Card className="bg-neutral-800 border-neutral-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Cell Test Results</CardTitle>
            <CardDescription className="text-neutral-300">
              {filteredBatteries.length} cells found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-700">
                    <th className="px-4 py-3 text-neutral-300">ID</th>
                    <th className="px-4 py-3 text-neutral-300">Cell Name</th>
                    <th className="px-4 py-3 text-neutral-300">Status</th>
                    <th className="px-4 py-3 text-neutral-300">SoC</th>
                    <th className="px-4 py-3 text-neutral-300">SoH</th>
                    <th className="px-4 py-3 text-neutral-300">Voltage</th>
                    <th className="px-4 py-3 text-neutral-300">Capacity</th>
                    <th className="px-4 py-3 text-neutral-300">Max V</th>
                    <th className="px-4 py-3 text-neutral-300">Min V</th>
                    <th className="px-4 py-3 text-neutral-300">Store V</th>
                    <th className="px-4 py-3 text-neutral-300">ESR</th>
                    <th className="px-4 py-3 text-neutral-300">Cycles</th>
                    <th className="px-4 py-3 text-neutral-300">Last Test</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBatteries.length > 0 ? (
                    filteredBatteries.map((battery) => (
                      <tr key={battery.id} className="border-b border-neutral-700 hover:bg-neutral-700/50 transition-colors">
                        <td className="px-4 py-3 text-white">#{battery.id}</td>
                        <td className="px-4 py-3 text-white">{battery.name}</td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-2">
                            <span className={`inline-block w-3 h-3 rounded-full ${getStatusColor(battery.status)}`}></span>
                            <span className="text-white capitalize">{battery.status}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-white">{battery.soc.toFixed(2)}%</td>
                        <td className="px-4 py-3 text-white">{battery.soh.toFixed(2)}%</td>
                        <td className="px-4 py-3 text-white">{battery.voltage.toFixed(2)}V</td>
                        <td className="px-4 py-3 text-white">{battery.capacityAh ? `${battery.capacityAh.toFixed(2)}Ah` : 'N/A'}</td>
                        <td className="px-4 py-3 text-white">{battery.maxVoltage ? `${battery.maxVoltage.toFixed(2)}V` : 'N/A'}</td>
                        <td className="px-4 py-3 text-white">{battery.minVoltage ? `${battery.minVoltage.toFixed(2)}V` : 'N/A'}</td>
                        <td className="px-4 py-3 text-white">{battery.storeVoltage ? `${battery.storeVoltage.toFixed(2)}V` : 'N/A'}</td>
                        <td className="px-4 py-3 text-white">{battery.esr}mΩ</td>
                        <td className="px-4 py-3 text-white">{battery.cycleCount}</td>
                        <td className="px-4 py-3 text-white">{new Date(battery.lastUpdated).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={13} className="px-4 py-8 text-center text-neutral-400">
                        No tested cells found matching current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default TestedCells;
