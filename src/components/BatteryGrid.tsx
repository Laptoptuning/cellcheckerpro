import React, { useState, useEffect } from 'react';
import { Battery } from '@/types/battery';
import BatteryCell from './BatteryCell';
import DetailedView from './DetailedView';
import { Button } from '@/components/ui/button';
import { CheckCheck, X } from 'lucide-react';
import { loadBatteries, saveBattery } from '@/services/batteryStorage';
import { fetchBatteryData } from '@/services/apiService';
import { toast } from '@/components/ui/use-toast';

interface BatteryGridProps {
  onSelectCell?: (cellId: number, selected: boolean) => void;
  selectedCells?: number[];
  showOnlyAvailable?: boolean;
}

const BatteryGrid: React.FC<BatteryGridProps> = ({ 
  onSelectCell,
  selectedCells = [],
  showOnlyAvailable = false
}) => {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [selectedBattery, setSelectedBattery] = useState<Battery | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize batteries
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Try to fetch from API first
        const apiBatteries = await fetchBatteryData();
        setBatteries(apiBatteries);
        
        // Store the fetched data in local storage
        apiBatteries.forEach(battery => {
          saveBattery(battery);
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching battery data:', err);
        setError('Could not connect to battery management system. Using cached data.');
        
        // Fallback to storage
        const storedBatteries = loadBatteries();
        setBatteries(storedBatteries);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Set up polling interval
    const interval = setInterval(fetchData, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Show toast for errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Connection Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);
  
  // Filter batteries if needed
  const displayedBatteries = showOnlyAvailable 
    ? batteries.filter(b => !(b as any).projectId) 
    : batteries;
  
  // Handle cell click
  const handleCellClick = (battery: Battery) => {
    setSelectedBattery(battery);
    setIsModalOpen(true);
  };
  
  // Handle cell selection
  const handleCellSelection = (battery: Battery) => {
    if (onSelectCell) {
      const isSelected = selectedCells.includes(battery.id);
      onSelectCell(battery.id, !isSelected);
    }
  };
  
  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle select all cells
  const handleSelectAllCells = () => {
    if (onSelectCell) {
      // If all cells are already selected, deselect all
      if (selectedCells.length === displayedBatteries.length) {
        displayedBatteries.forEach(battery => {
          onSelectCell(battery.id, false);
        });
      } 
      // Otherwise, select all cells
      else {
        displayedBatteries.forEach(battery => {
          if (!selectedCells.includes(battery.id)) {
            onSelectCell(battery.id, true);
          }
        });
      }
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-neutral-400">
          {selectedCells.length} of {displayedBatteries.length} cells selected
          {isLoading && <span className="ml-2 animate-pulse"> (Refreshing...)</span>}
        </div>
        <Button
          variant="outline" 
          size="sm"
          className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 border-neutral-600"
          onClick={handleSelectAllCells}
        >
          {selectedCells.length === displayedBatteries.length ? (
            <>
              <X className="h-4 w-4" />
              <span>Deselect All</span>
            </>
          ) : (
            <>
              <CheckCheck className="h-4 w-4" />
              <span>Select All</span>
            </>
          )}
        </Button>
      </div>
      
      {isLoading && batteries.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
          {displayedBatteries.map((battery) => (
            <BatteryCell 
              key={battery.id} 
              battery={battery} 
              onClick={handleCellClick}
              onSelect={() => handleCellSelection(battery)}
              isSelected={selectedCells.includes(battery.id)}
              className="animate-scale-in"
            />
          ))}
        </div>
      )}
      
      {selectedBattery && (
        <DetailedView 
          battery={selectedBattery} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default BatteryGrid;
