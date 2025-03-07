
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TestType } from '@/types/battery';

interface StatusCardProps {
  currentTest: TestType | null;
  selectedCells: number[];
  testInProgress: boolean;
}

const StatusCard: React.FC<StatusCardProps> = ({ currentTest, selectedCells, testInProgress }) => {
  return (
    <Card className="bg-neutral-800 border-neutral-700">
      <CardHeader>
        <CardTitle className="text-white">Status</CardTitle>
        <CardDescription className="text-neutral-300">Current test progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-neutral-300 mb-1">Test Type:</p>
            <p className="text-lg font-medium text-white">
              {currentTest ? currentTest.charAt(0).toUpperCase() + currentTest.slice(1) : 'None'}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-neutral-300 mb-1">Cells Selected:</p>
            <p className="text-lg font-medium text-white">{selectedCells.length}</p>
          </div>
          
          <div>
            <p className="text-sm text-neutral-300 mb-1">Status:</p>
            <div className="flex items-center gap-2">
              {testInProgress ? (
                <>
                  <span className="h-2 w-2 bg-success-500 rounded-full animate-pulse"></span>
                  <p className="text-success-500">Running</p>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 bg-neutral-500 rounded-full"></span>
                  <p className="text-neutral-300">Idle</p>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
