import React, { useState, useEffect } from 'react';
import { Battery } from '@/types/battery';
import BatteryCell from './BatteryCell';
import DetailedView from './DetailedView';
import { Button } from '@/components/ui/button';
import { CheckCheck, X, RefreshCw } from 'lucide-react';
import { fetchBatteries, isApiConnected } from '@/services/apiService';
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
  
  const loadBatteriesData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchBatteries();
      setBatteries(data);
    } catch (error) {
      console.error('Error fetching batteries:', error);
      toast({
        title: "Connection Error",
        description: "Failed to fetch battery data. Using simulation mode.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadBatteriesData();
    
    const interval = setInterval(() => {
      loadBatteriesData();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const displayedBatteries = showOnlyAvailable 
    ? batteries.filter(b => !(b as any).projectId) 
    : batteries;
  
  const handleCellClick = (battery: Battery) => {
    setSelectedBattery(battery);
    setIsModalOpen(true);
  };
  
  const handleCellSelection = (battery: Battery) => {
    if (onSelectCell) {
      const isSelected = selectedCells.includes(battery.id);
      onSelectCell(battery.id, !isSelected);
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectAllCells = () => {
    if (onSelectCell) {
      if (selectedCells.length === displayedBatteries.length) {
        displayedBatteries.forEach(battery => {
          onSelectCell(battery.id, false);
        });
      } 
      else {
        displayedBatteries.forEach(battery => {
          if (!selectedCells.includes(battery.id)) {
            onSelectCell(battery.id, true);
          }
        });
      }
    }
  };

  const handleRefresh = () => {
    loadBatteriesData();
    toast({
      title: "Refreshing Data",
      description: "Fetching the latest battery data..."
    });
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-neutral-400">
          {selectedCells.length} of {displayedBatteries.length} cells selected
          {!isApiConnected() && (
            <span className="ml-2 text-warning-400">(Simulation Mode)</span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 border-neutral-600"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
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
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-primary">Loading battery data...</div>
        </div>
      ) : displayedBatteries.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-neutral-400">No battery cells found</div>
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
