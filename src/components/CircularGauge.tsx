
import React from 'react';
import { cn } from '@/lib/utils';

interface CircularGaugeProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  thickness?: 'thin' | 'normal' | 'thick';
  label?: string;
  colorMap?: {
    [key: number]: string;
  };
  className?: string;
}

const CircularGauge: React.FC<CircularGaugeProps> = ({
  value,
  max = 100,
  size = 'md',
  thickness = 'normal',
  label,
  colorMap = { 0: '#ef4444', 50: '#f59e0b', 75: '#10b981' },
  className,
}) => {
  // Normalize value between 0 and 100
  const normalizedValue = Math.min(100, Math.max(0, (value / max) * 100));
  
  // Calculate sizes based on the size prop
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };
  
  // Calculate stroke width based on thickness
  const strokeWidth = {
    thin: 2,
    normal: 4,
    thick: 6,
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
  
  // Calculate SVG parameters
  const size = size === 'sm' ? 64 : size === 'md' ? 96 : 128;
  const strokeW = strokeWidth[thickness];
  const radius = (size / 2) - (strokeW / 2);
  const circumference = 2 * Math.PI * radius;
  const dash = (normalizedValue / 100) * circumference;
  const gap = circumference - dash;
  const color = getColor(normalizedValue);
  
  // Font sizes for the value text
  const textSizeClass = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';
  const valueSizeClass = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-3xl';
  
  return (
    <div className={cn(`gauge-container ${sizeClasses[size]}`, className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#e5e7eb"
          strokeWidth={strokeW}
          className="opacity-20"
        />
        
        {/* Foreground circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeW}
          strokeDasharray={circumference}
          strokeDashoffset={gap}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      
      <div className="gauge-value flex flex-col items-center justify-center w-full h-full">
        <span className={`font-semibold ${valueSizeClass} transition-all duration-300`} style={{ color }}>
          {Math.round(normalizedValue)}%
        </span>
        {label && <span className={`${textSizeClass} text-neutral-500 mt-1`}>{label}</span>}
      </div>
    </div>
  );
};

export default CircularGauge;
