
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
  const [refreshing, setRefreshing] = useState(false);
  
  // Initialize batteries
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Show refreshing indicator only after initial load
        if (batteries.length > 0) {
          setRefreshing(true);
        }
        
        // Try to fetch from API (with fallback to mock data built in)
        const fetchedBatteries = await fetchBatteryData();
        setBatteries(fetchedBatteries);
        
        // Store the fetched data in local storage
        fetchedBatteries.forEach(battery => {
          saveBattery(battery);
        });
        
        setError(null);
      } catch (err) {
        console.error('Error in battery data handling:', err);
        setError('Error loading battery data. Please try again.');
        
        // Fallback to storage if we have absolutely nothing
        if (batteries.length === 0) {
          const storedBatteries = loadBatteries();
          if (storedBatteries.length > 0) {
            setBatteries(storedBatteries);
          }
        }
      } finally {
        setIsLoading(false);
        setRefreshing(false);
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
        title: "Data Error",
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
  
  // Manual refresh function
  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      const freshBatteries = await fetchBatteryData();
      setBatteries(freshBatteries);
      toast({
        title: "Data Refreshed",
        description: "Battery data has been manually refreshed",
      });
    } catch (err) {
      toast({
        title: "Refresh Failed",
        description: "Could not refresh battery data",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-neutral-400">
          {selectedCells.length} of {displayedBatteries.length} cells selected
          {refreshing && <span className="ml-2 animate-pulse"> (Refreshing...)</span>}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 border-neutral-600"
            onClick={handleManualRefresh}
            disabled={refreshing}
          >
            <span>Refresh</span>
          </Button>
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
      </div>
      
      {isLoading && batteries.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : displayedBatteries.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-neutral-400">
          <p className="text-xl">No battery data available</p>
          <p className="mt-2">Check your connection to the battery management system</p>
          <Button 
            variant="outline" 
            className="mt-4 bg-neutral-700 hover:bg-neutral-600"
            onClick={handleManualRefresh}
          >
            Try Again
          </Button>
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
