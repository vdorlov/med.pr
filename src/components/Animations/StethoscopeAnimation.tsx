import React from 'react';
import { Stethoscope } from 'lucide-react';

interface StethoscopeAnimationProps {
  className?: string;
  size?: number;
}

const StethoscopeAnimation: React.FC<StethoscopeAnimationProps> = ({ 
  className = '',
  size = 48
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="animate-float">
        <Stethoscope size={size} className="text-blue-500" />
      </div>
    </div>
  );
};

export default StethoscopeAnimation;