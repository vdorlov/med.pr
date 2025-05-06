import React from 'react';

interface MedicalCrossProps {
  className?: string;
  size?: number;
}

const MedicalCross: React.FC<MedicalCrossProps> = ({ className = '', size = 40 }) => {
  return (
    <div 
      className={`relative ${className}`} 
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="bg-red-500 rounded-sm animate-pulse"
          style={{ 
            width: size * 0.8, 
            height: size * 0.2,
          }}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="bg-red-500 rounded-sm animate-pulse"
          style={{ 
            width: size * 0.2, 
            height: size * 0.8,
          }}
        />
      </div>
    </div>
  );
};

export default MedicalCross;