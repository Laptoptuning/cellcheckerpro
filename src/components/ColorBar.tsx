
import React from 'react';
import { cn } from '@/lib/utils';

interface ColorBarProps {
  value: number;
  max?: number;
  label?: string;
  height?: 'thin' | 'normal' | 'thick';
  colorMap?: {
    [key: number]: string;
  };
  showValue?: boolean;
  className?: string;
}

const ColorBar: React.FC<ColorBarProps> = ({
  value,
  max = 100,
  label,
  height = 'normal',
  colorMap = { 0: '#ef4444', 50: '#f59e0b', 75: '#10b981' },
  showValue = true,
  className,
}) => {
  // Normalize value between 0 and 100
  const normalizedValue = Math.min(100, Math.max(0, (value / max) * 100));
  
  // Calculate height based on the height prop
  const heightClasses = {
    thin: 'h-1',
    normal: 'h-2',
    thick: 'h-3',
  };
  
  // Get color based on normalized value
  const getColor = (value: number): string => {
    const thresholds = Object.keys(colorMap)
      .map(Number)
      .sort((a, b) => a - b);
    
    let color = colorMap[thresholds[0]];
    
    for (const threshold of thresholds) {
      if (value >= threshold) {
        color = colorMap[threshold];
      } else {
        break;
      }
    }
    
    return color;
  };
  
  const color = getColor(normalizedValue);
  
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-neutral-600">{label}</span>
          {showValue && (
            <span className="text-xs font-medium" style={{ color }}>
              {typeof value === 'number' ? value.toFixed(1) : value}
              {max !== 1 && '%'}
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-neutral-200 rounded-full overflow-hidden ${heightClasses[height]}`}>
        <div
          className="rounded-full transition-all duration-500 ease-in-out"
          style={{
            width: `${normalizedValue}%`,
            backgroundColor: color,
            height: '100%',
          }}
        />
      </div>
    </div>
  );
};

export default ColorBar;
