
import React from 'react';
import { Battery } from '@/types/battery';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Battery as BatteryIcon, Zap, Thermometer, Scale, Clock, Activity, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ColorBar from './ColorBar';

interface CellSpecificationsProps {
  battery: Battery;
  className?: string;
}

const CellSpecifications: React.FC<CellSpecificationsProps> = ({ battery, className }) => {
  // Get battery color based on status
  const getBatteryStatusColor = (status: 'good' | 'warning' | 'danger'): string => {
    switch(status) {
      case 'good': return '#22c55e'; // vibrant green
      case 'warning': return '#f97316'; // vibrant orange
      case 'danger': return '#ef4444'; // vibrant red
      default: return '#22c55e';
    }
  };
  
  const statusColor = getBatteryStatusColor(battery.status);
  
  return (
    <Card className={`bg-neutral-800 border-neutral-700 text-white ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-white">Cell Specifications</CardTitle>
          <span className="text-xs text-neutral-400">
            Updated {formatDistanceToNow(battery.lastUpdated, { addSuffix: true })}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Cell Identity */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-neutral-400">Cell ID</span>
            <span className="text-lg font-medium text-white">{battery.name}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-neutral-400">Status</span>
            <div className="flex items-center gap-2">
              <span 
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: statusColor }}
              ></span>
              <span className="text-lg font-medium text-white capitalize">{battery.status}</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-neutral-400">Type</span>
            <span className="text-lg font-medium text-white">Li-ion 18650</span>
          </div>
        </div>
        
        {/* Primary Stats with Large Visuals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
          {/* SOC Visual */}
          <div className="flex items-center gap-4">
            <div className="relative min-w-16 h-24">
              {/* Battery body */}
              <div className="absolute inset-0 rounded-md bg-neutral-700 border-2 border-neutral-600 overflow-hidden" style={{ borderRadius: '4px 4px 4px 4px' }}>
                {/* Battery terminals */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-5 h-1.5 bg-neutral-600 rounded-t-md"></div>
                
                {/* Battery level */}
                <div 
                  className="absolute bottom-0 left-0 right-0 transition-all duration-500"
                  style={{ 
                    height: `${battery.soc}%`, 
                    backgroundColor: statusColor,
                    boxShadow: `0 0 10px ${statusColor}80`,
                  }}
                >
                  {/* Battery level glossy effect */}
                  <div className="absolute bottom-0 left-0 right-0 h-full opacity-20 bg-gradient-to-t from-transparent to-white"></div>
                </div>
                
                {/* Battery segments/indicators */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[20, 40, 60, 80].map((level) => (
                    <div key={level} className="w-full h-px bg-neutral-600 opacity-50"></div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-neutral-400">State of Charge</span>
              <span className="text-2xl font-bold text-white">{battery.soc.toFixed(2)}%</span>
              <div className="mt-1">
                <span className="text-xs text-neutral-400">Current Voltage</span>
                <div className="flex items-center gap-1 text-white">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  <span className="text-base font-medium">{battery.voltage.toFixed(2)}V</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* SOH Visual */}
          <div className="space-y-2">
            <span className="text-sm text-neutral-400">State of Health</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{battery.soh.toFixed(2)}%</span>
              <div 
                className="h-2.5 w-2.5 rounded-full ml-1" 
                style={{ 
                  backgroundColor: battery.soh > 80 ? '#22c55e' : battery.soh > 50 ? '#f97316' : '#ef4444' 
                }}
              ></div>
            </div>
            
            <ColorBar 
              value={battery.soh} 
              height="thick"
              colorMap={{ 0: '#ef4444', 50: '#f97316', 75: '#22c55e' }}
              className="mt-2"
            />
            
            <div className="mt-1 grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-neutral-400">Original Capacity</span>
                <div className="text-base font-medium text-white">{battery.capacityAh?.toFixed(2) || "2.50"}Ah</div>
              </div>
              <div>
                <span className="text-xs text-neutral-400">Measured Capacity</span>
                <div className="text-base font-medium text-white">
                  {((battery.capacityAh || 2.5) * (battery.soh / 100)).toFixed(2)}Ah
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Detailed Technical Specifications */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-neutral-700">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-neutral-400 text-sm">
              <Thermometer className="h-4 w-4" />
              <span>Temperature</span>
            </div>
            <span className="text-lg font-medium text-white">{battery.temperature}°C</span>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-neutral-400 text-sm">
              <Activity className="h-4 w-4" />
              <span>ESR</span>
            </div>
            <span className="text-lg font-medium text-white">{battery.esr}mΩ</span>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-neutral-400 text-sm">
              <Zap className="h-4 w-4" />
              <span>Max Voltage</span>
            </div>
            <span className="text-lg font-medium text-white">{battery.maxVoltage || "4.20"}V</span>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-neutral-400 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>Min Voltage</span>
            </div>
            <span className="text-lg font-medium text-white">{battery.minVoltage || "2.80"}V</span>
          </div>
        </div>
        
        {/* Additional Specifications */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-neutral-400 text-sm">
              <BatteryIcon className="h-4 w-4" />
              <span>Store Voltage</span>
            </div>
            <span className="text-lg font-medium text-white">{battery.storeVoltage || "3.40"}V</span>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-neutral-400 text-sm">
              <Scale className="h-4 w-4" />
              <span>Recommended Load</span>
            </div>
            <span className="text-lg font-medium text-white">0.5-2.0A</span>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-neutral-400 text-sm">
              <Clock className="h-4 w-4" />
              <span>Cycle Count</span>
            </div>
            <span className="text-lg font-medium text-white">{battery.cycleCount || "Unknown"}</span>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-neutral-400 text-sm">
              <Clock className="h-4 w-4" />
              <span>Manufacture Date</span>
            </div>
            <span className="text-lg font-medium text-white">Unknown</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CellSpecifications;
