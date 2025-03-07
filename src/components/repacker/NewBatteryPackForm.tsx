
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Battery as BatteryIcon, Zap } from 'lucide-react';

interface NewBatteryPackFormProps {
  selectedCellCount: number;
  onCreatePack: (packName: string, configuration: string) => void;
}

const NewBatteryPackForm: React.FC<NewBatteryPackFormProps> = ({ 
  selectedCellCount,
  onCreatePack
}) => {
  const [packName, setPackName] = useState('New Battery Pack');
  const [seriesCount, setSeriesCount] = useState(4);
  const [parallelCount, setParallelCount] = useState(1);
  
  const totalCells = seriesCount * parallelCount;
  const cellsNeeded = totalCells - selectedCellCount;
  const canCreatePack = selectedCellCount >= totalCells;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canCreatePack) {
      const configuration = `${seriesCount}S${parallelCount}P`;
      onCreatePack(packName, configuration);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-neutral-400 mb-1">Pack Name</label>
        <Input
          value={packName}
          onChange={(e) => setPackName(e.target.value)}
          className="bg-neutral-700 border-neutral-600 placeholder-neutral-500 text-neutral-100"
        />
      </div>
      
      <div>
        <label className="block text-sm text-neutral-400 mb-2">Configuration</label>
        <div className="flex flex-col space-y-3">
          <div className="flex items-center">
            <BatteryIcon className="mr-2 h-4 w-4 text-neutral-400" />
            <span className="text-sm text-neutral-400 mr-2">Series: </span>
            <div className="flex items-center">
              <button 
                type="button"
                onClick={() => setSeriesCount(Math.max(1, seriesCount - 1))}
                className="px-2 bg-neutral-700 rounded-l-md border border-neutral-600"
              >
                -
              </button>
              <div className="w-10 text-center py-1 bg-neutral-700 border-t border-b border-neutral-600">
                {seriesCount}
              </div>
              <button 
                type="button"
                onClick={() => setSeriesCount(seriesCount + 1)}
                className="px-2 bg-neutral-700 rounded-r-md border border-neutral-600"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            <Zap className="mr-2 h-4 w-4 text-neutral-400" />
            <span className="text-sm text-neutral-400 mr-2">Parallel: </span>
            <div className="flex items-center">
              <button 
                type="button"
                onClick={() => setParallelCount(Math.max(1, parallelCount - 1))}
                className="px-2 bg-neutral-700 rounded-l-md border border-neutral-600"
              >
                -
              </button>
              <div className="w-10 text-center py-1 bg-neutral-700 border-t border-b border-neutral-600">
                {parallelCount}
              </div>
              <button 
                type="button"
                onClick={() => setParallelCount(parallelCount + 1)}
                className="px-2 bg-neutral-700 rounded-r-md border border-neutral-600"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-2">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-neutral-400">Configuration:</span>
          <span className="font-medium text-neutral-200">{seriesCount}S{parallelCount}P</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-neutral-400">Total Cells Needed:</span>
          <span className="font-medium text-neutral-200">{totalCells}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-neutral-400">Cells Selected:</span>
          <span className="font-medium text-neutral-200">{selectedCellCount}</span>
        </div>
        {!canCreatePack && (
          <div className="flex justify-between text-sm mb-4">
            <span className="text-warning-500">Additional Cells Needed:</span>
            <span className="font-medium text-warning-500">{cellsNeeded}</span>
          </div>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90"
        disabled={!canCreatePack}
      >
        {canCreatePack 
          ? `Create Battery Pack (${totalCells} cells)` 
          : `Need ${cellsNeeded} more cell${cellsNeeded !== 1 ? 's' : ''}`
        }
      </Button>
    </form>
  );
};

export default NewBatteryPackForm;
