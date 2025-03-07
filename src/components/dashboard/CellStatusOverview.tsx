
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import BatteryGrid from '@/components/BatteryGrid';

interface CellStatusOverviewProps {
  selectedCells: number[];
  onSelectCell: (cellId: number, selected: boolean) => void;
}

const CellStatusOverview: React.FC<CellStatusOverviewProps> = ({ 
  selectedCells, 
  onSelectCell 
}) => {
  return (
    <Card className="bg-neutral-800 border-neutral-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-neutral-100">Cell Status Overview</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-success-500 mr-1.5"></span>
              <span className="text-neutral-300">Good</span>
            </span>
            <span className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-warning-500 mr-1.5"></span>
              <span className="text-neutral-300">Warning</span>
            </span>
            <span className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-danger-500 mr-1.5"></span>
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
          onSelectCell={onSelectCell} 
          selectedCells={selectedCells}
        />
      </CardContent>
    </Card>
  );
};

export default CellStatusOverview;
