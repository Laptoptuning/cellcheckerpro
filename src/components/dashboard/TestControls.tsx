
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestType } from '@/types/battery';
import { Zap, MoveDown, TestTube, Trash, Battery, Play, Pause, FlaskConical } from 'lucide-react';
import StatusCard from './StatusCard';
import { isApiConnected } from '@/services/apiService';

interface TestControlsProps {
  selectedCells: number[];
  testInProgress: boolean;
  currentTest: TestType | null;
  onStartTest: (testType: TestType) => void;
  onStopTest: () => void;
  onDisposeCells: () => void;
}

const TestControls: React.FC<TestControlsProps> = ({
  selectedCells,
  testInProgress,
  currentTest,
  onStartTest,
  onStopTest,
  onDisposeCells
}) => {
  // Determine if we need to show simulation mode indicator
  const simulationMode = !isApiConnected();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-neutral-800 border-neutral-700 col-span-1 lg:col-span-3">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-neutral-100">Test Controls</CardTitle>
              <CardDescription className="text-neutral-400">
                Start or stop tests for selected cells
                {simulationMode && (
                  <span className="ml-2 text-warning-400">(Simulation Mode)</span>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center gap-3 h-24 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 border-neutral-600"
              onClick={() => onStartTest('charge')}
              disabled={testInProgress}
            >
              <Zap className="h-8 w-8 text-success-400" />
              <div className="flex flex-col items-center">
                <span>Start Charging</span>
                <span className="text-xs text-neutral-400">Charge to 4.2V</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center gap-3 h-24 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 border-neutral-600"
              onClick={() => onStartTest('discharge')}
              disabled={testInProgress}
            >
              <MoveDown className="h-8 w-8 text-warning-400" />
              <div className="flex flex-col items-center">
                <span>Start Discharging</span>
                <span className="text-xs text-neutral-400">Discharge to 2.8V</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center gap-3 h-24 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 border-neutral-600"
              onClick={() => onStartTest('esr')}
              disabled={testInProgress}
            >
              <TestTube className="h-8 w-8 text-primary" />
              <div className="flex flex-col items-center">
                <span>Measure ESR</span>
                <span className="text-xs text-neutral-400">Internal resistance</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center gap-3 h-24 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 border-neutral-600"
              onClick={() => onStartTest('capacity')}
              disabled={testInProgress}
            >
              <FlaskConical className="h-8 w-8 text-warning-500" />
              <div className="flex flex-col items-center">
                <span>Measure Capacity</span>
                <span className="text-xs text-neutral-400">Full cycle test</span>
              </div>
            </Button>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <Button 
              variant="destructive" 
              className="flex items-center gap-2"
              onClick={onDisposeCells}
              disabled={testInProgress || selectedCells.length === 0}
            >
              <Trash className="h-5 w-5" />
              <span>Dispose Cells</span>
            </Button>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 border-neutral-600"
                onClick={() => onStartTest('store')}
                disabled={testInProgress || selectedCells.length === 0}
              >
                <Battery className="h-5 w-5 text-success-400" />
                <span>Store (3.4V)</span>
              </Button>
              
              {testInProgress ? (
                <Button 
                  variant="default" 
                  className="bg-danger-500 hover:bg-danger-600 flex items-center gap-2"
                  onClick={onStopTest}
                >
                  <Pause className="h-5 w-5" />
                  <span>Stop Test</span>
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                  onClick={() => onStartTest('macro')}
                  disabled={selectedCells.length === 0}
                >
                  <Play className="h-5 w-5" />
                  <span>Start Macro</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <StatusCard 
        currentTest={currentTest} 
        selectedCells={selectedCells} 
        testInProgress={testInProgress} 
      />
    </div>
  );
};

export default TestControls;
