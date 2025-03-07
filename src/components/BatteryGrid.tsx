import React, { useState, useEffect } from 'react';
import { Battery } from '@/types/battery';
import BatteryCell from './BatteryCell';
import { generateMockBatteries, updateBatteryData } from '@/utils/mockData';
import DetailedView from './DetailedView';
import { Button } from '@/components/ui/button';
import { CheckCheck, X } from 'lucide-react';

interface BatteryGridProps {
  onSelectCell?: (cellId: number, selected: boolean) => void;
  selectedCells?: number[];
}

const BatteryGrid: React.FC<BatteryGridProps> = ({ 
  onSelectCell,
  selectedCells = []
}) => {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [selectedBattery, setSelectedBattery] = useState<Battery | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Initialize batteries
  useEffect(() => {
    const initialBatteries = generateMockBatteries(16);
    setBatteries(initialBatteries);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setBatteries((prevBatteries) => 
        prevBatteries.map(battery => updateBatteryData(battery))
      );
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
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
      if (selectedCells.length === batteries.length) {
        batteries.forEach(battery => {
          onSelectCell(battery.id, false);
        });
      } 
      // Otherwise, select all cells
      else {
        batteries.forEach(battery => {
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
          {selectedCells.length} of {batteries.length} cells selected
        </div>
        <Button
          variant="outline" 
          size="sm"
          className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 border-neutral-600"
          onClick={handleSelectAllCells}
        >
          {selectedCells.length === batteries.length ? (
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
        {batteries.map((battery) => (
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
