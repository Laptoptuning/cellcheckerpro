
import React from 'react';
import { Battery } from '@/types/battery';
import ColorBar from './ColorBar';
import StatusIndicator from './StatusIndicator';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Check, Battery as BatteryIcon } from 'lucide-react';

interface BatteryCellProps {
  battery: Battery;
  className?: string;
  onClick?: (battery: Battery) => void;
  onSelect?: () => void;
  isSelected?: boolean;
}

const BatteryCell: React.FC<BatteryCellProps> = ({ 
  battery, 
  className, 
  onClick,
  onSelect,
  isSelected = false
}) => {
  const handleClick = () => {
    if (onClick) onClick(battery);
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) onSelect();
  };
  
  // Determine voltage status
  const getVoltageStatus = (voltage: number): 'good' | 'warning' | 'danger' => {
    if (voltage < 3.2) return 'danger';
    if (voltage < 3.5) return 'warning';
    return 'good';
  };
  
  // Determine temperature status
  const getTemperatureStatus = (temp: number): 'good' | 'warning' | 'danger' => {
    if (temp > 40) return 'danger';
    if (temp > 35) return 'warning';
    return 'good';
  };
  
  // Determine ESR status
  const getEsrStatus = (esr: number): 'good' | 'warning' | 'danger' => {
    if (esr > 70) return 'danger';
    if (esr > 40) return 'warning';
    return 'good';
  };

  // Get battery icon color based on SOC
  const getBatteryColor = (soc: number): string => {
    if (soc < 20) return '#ef4444'; // red
    if (soc < 50) return '#f59e0b'; // amber
    return '#10b981'; // green
  };
  
  return (
    <div 
      className={cn(
        'battery-cell relative p-5 flex flex-col gap-4 cursor-pointer bg-neutral-800 border border-neutral-700 rounded-xl hover:bg-neutral-750 transition-all',
        {
          'ring-2 ring-success-500': battery.status === 'good',
          'ring-2 ring-warning-500': battery.status === 'warning',
          'ring-2 ring-danger-500': battery.status === 'danger',
          'bg-neutral-750 border-primary': isSelected,
        },
        className
      )}
      onClick={handleClick}
    >
      {/* Selection checkbox */}
      <div 
        className={cn(
          "absolute top-2 left-2 w-5 h-5 rounded-full border border-neutral-600 z-10 cursor-pointer flex items-center justify-center",
          {
            "bg-primary border-primary": isSelected,
            "hover:border-primary": !isSelected
          }
        )}
        onClick={handleSelectClick}
      >
        {isSelected && <Check className="w-3 h-3 text-white" />}
      </div>

      {/* Updated indicator */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5">
        <div className={cn(
          'w-2 h-2 rounded-full animate-pulse-smooth',
          {
            'bg-success-500': battery.status === 'good',
            'bg-warning-500': battery.status === 'warning',
            'bg-danger-500': battery.status === 'danger',
          }
        )} />
        <span className="text-xs text-neutral-400">
          {formatDistanceToNow(battery.lastUpdated, { addSuffix: true })}
        </span>
      </div>
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-neutral-100">{battery.name}</h3>
        <StatusIndicator 
          status={battery.status} 
          value={battery.cycleCount} 
          unit="cy"
          size="sm"
        />
      </div>
      
      {/* Battery icon and SOC */}
      <div className="flex justify-center items-center gap-3 my-1">
        <div className="relative flex items-center justify-center">
          <BatteryIcon 
            size={48} 
            className="text-neutral-600"
          />
          <div 
            className="absolute inset-0 flex items-center" 
            style={{ paddingLeft: '4px', paddingRight: '6px' }}
          >
            <div 
              className="h-3 rounded-sm transition-all duration-500" 
              style={{ 
                width: `${battery.soc}%`, 
                backgroundColor: getBatteryColor(battery.soc),
                maxWidth: '100%'
              }} 
            />
          </div>
          <span className="absolute text-xs font-semibold text-white">{Math.round(battery.soc)}%</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-lg font-semibold text-neutral-100">{battery.voltage.toFixed(1)}V</span>
          <span className="text-xs text-neutral-400">State of Charge</span>
        </div>
      </div>
      
      {/* SOH bar */}
      <ColorBar 
        value={battery.soh} 
        label="SoH" 
        colorMap={{ 0: '#ef4444', 70: '#f59e0b', 85: '#10b981' }}
      />
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <StatusIndicator
          status={getVoltageStatus(battery.voltage)}
          icon="voltage"
          value={battery.voltage}
          unit="V"
          size="sm"
        />
        
        <StatusIndicator
          status={getTemperatureStatus(battery.temperature)}
          icon="temperature"
          value={battery.temperature}
          unit="°C"
          size="sm"
        />
        
        <StatusIndicator
          status={getEsrStatus(battery.esr)}
          icon="resistance"
          value={battery.esr}
          unit="mΩ"
          size="sm"
        />
      </div>
    </div>
  );
};

export default BatteryCell;
