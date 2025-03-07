
import React from 'react';
import { cn } from '@/lib/utils';
import { Battery, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning, Thermometer, Zap } from 'lucide-react';

type StatusType = 'good' | 'warning' | 'danger';
type IconType = 'battery' | 'voltage' | 'temperature' | 'resistance';

interface StatusIndicatorProps {
  status: StatusType;
  icon?: IconType;
  value: number | string;
  unit?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  icon,
  value,
  unit = '',
  label,
  size = 'md',
  className,
}) => {
  // Determine the status class
  const statusClasses = {
    good: 'status-good',
    warning: 'status-warning',
    danger: 'status-danger',
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs p-1.5 rounded-md',
    md: 'text-sm p-2 rounded-lg',
    lg: 'text-base p-3 rounded-xl',
  };
  
  const iconSizeClass = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';
  const textSizeClass = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';
  const valueSizeClass = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg';
  
  // Get the appropriate icon based on type and status
  const getIcon = () => {
    if (!icon) return null;
    
    switch (icon) {
      case 'battery':
        if (status === 'good') return <BatteryFull className={iconSizeClass} />;
        if (status === 'warning') return <BatteryMedium className={iconSizeClass} />;
        return <BatteryLow className={iconSizeClass} />;
      
      case 'voltage':
        return <Zap className={iconSizeClass} />;
      
      case 'temperature':
        return <Thermometer className={iconSizeClass} />;
      
      case 'resistance':
        return <Battery className={iconSizeClass} />;
      
      default:
        return null;
    }
  };
  
  return (
    <div className={cn(
      'flex items-center gap-2 border transition-all duration-300',
      statusClasses[status],
      sizeClasses[size],
      className
    )}>
      {icon && getIcon()}
      
      <div className="flex flex-col">
        <span className={`font-semibold ${valueSizeClass}`}>
          {typeof value === 'number' ? value.toFixed(1) : value}
          {unit && <span className="ml-0.5 font-normal opacity-70">{unit}</span>}
        </span>
        
        {label && <span className={`${textSizeClass} opacity-70`}>{label}</span>}
      </div>
    </div>
  );
};

export default StatusIndicator;
