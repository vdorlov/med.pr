import React from 'react';

interface HeartbeatProps {
  className?: string;
  width?: number;
}

const Heartbeat: React.FC<HeartbeatProps> = ({ className = '', width = 200 }) => {
  return (
    <div className={`relative ${className}`} style={{ width, height: width * 0.3 }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 200 60"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M0,30 L20,30 L30,10 L40,50 L50,30 L60,30 L70,20 L80,40 L90,30 L100,30 L110,10 L120,50 L130,30 L140,30 L150,20 L160,40 L170,30 L200,30" 
          stroke="#FF4560" 
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="200"
          strokeDashoffset="200"
          className="animate-dash"
        />
      </svg>
    </div>
  );
};

export default Heartbeat;