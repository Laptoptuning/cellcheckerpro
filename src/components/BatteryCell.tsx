
import React from 'react';
import { Battery } from '@/types/battery';
import ColorBar from './ColorBar';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

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
  
  // Get battery color based on SOC
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
          'bg-neutral-750 border-primary': isSelected,
        },
        className
      )}
      onClick={handleClick}
    >
      {/* Header with selection checkbox and cell name */}
      <div className="flex justify-between items-center">
        <div 
          className={cn(
            "w-5 h-5 rounded-full border border-neutral-600 z-10 cursor-pointer flex items-center justify-center",
            {
              "bg-primary border-primary": isSelected,
              "hover:border-primary": !isSelected
            }
          )}
          onClick={handleSelectClick}
        >
          {isSelected && <Check className="w-3 h-3 text-white" />}
        </div>
        <h3 className="text-lg font-semibold text-neutral-100">{battery.name}</h3>
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
      
      {/* Smaller battery icon */}
      <div className="flex justify-center items-center my-2">
        <div className="relative w-14 h-28 mx-auto">
          {/* Battery body */}
          <div className="absolute inset-0 rounded-md bg-neutral-700 border-2 border-neutral-600 overflow-hidden" style={{ borderRadius: '4px 4px 4px 4px' }}>
            {/* Battery terminals */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-6 h-1.5 bg-neutral-600 rounded-t-md"></div>
            
            {/* Battery level */}
            <div 
              className="absolute bottom-0 left-0 right-0 transition-all duration-500"
              style={{ 
                height: `${battery.soc}%`, 
                background: `linear-gradient(180deg, ${getBatteryColor(battery.soc)}ee, ${getBatteryColor(battery.soc)})`,
              }}
            >
              {/* Battery level glossy effect */}
              <div className="absolute bottom-0 left-0 right-0 h-full opacity-20 bg-gradient-to-t from-transparent to-white"></div>
            </div>
            
            {/* Battery percentage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white drop-shadow-md">{Math.round(battery.soc)}%</span>
            </div>
            
            {/* Battery segments/indicators */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[20, 40, 60, 80].map((level) => (
                <div key={level} className="w-full h-px bg-neutral-600 opacity-50"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* SOH bar */}
      <ColorBar 
        value={battery.soh} 
        label="SoH" 
        colorMap={{ 0: '#ef4444', 70: '#f59e0b', 85: '#10b981' }}
      />
      
      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="flex flex-col">
          <span className="text-xs text-neutral-400">Voltage</span>
          <span className="text-sm font-medium">{battery.voltage.toFixed(2)}V</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-xs text-neutral-400">Temp</span>
          <span className="text-sm font-medium">{battery.temperature}°C</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-xs text-neutral-400">ESR</span>
          <span className="text-sm font-medium">{battery.esr}mΩ</span>
        </div>
      </div>
    </div>
  );
};

export default BatteryCell;
