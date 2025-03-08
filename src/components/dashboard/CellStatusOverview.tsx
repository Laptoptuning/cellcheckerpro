
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
          <CardTitle className="text-white">Cell Status Overview</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-[#22c55e] mr-1.5 shadow-sm shadow-[#22c55e]/50"></span>
              <span className="text-white">Good</span>
            </span>
            <span className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-[#f97316] mr-1.5 shadow-sm shadow-[#f97316]/50"></span>
              <span className="text-white">Warning</span>
            </span>
            <span className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-[#ef4444] mr-1.5 shadow-sm shadow-[#ef4444]/50"></span>
              <span className="text-white">Critical</span>
            </span>
          </div>
        </div>
        <CardDescription className="text-neutral-300">
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
