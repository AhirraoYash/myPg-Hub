import React from 'react';

export function Logo({ className = "w-8 h-8", primaryColor = "currentColor", secondaryColor = "currentColor" }: { className?: string, primaryColor?: string, secondaryColor?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Premium Shield Base */}
      <path 
        d="M24 4L44 10V24C44 36 24 44 24 44C24 44 4 36 4 24V10L24 4Z" 
        fill={primaryColor} 
        fillOpacity="0.1" 
        stroke={primaryColor} 
        strokeWidth="3.5" 
        strokeLinejoin="round"
      />
      {/* The 'Y' */}
      <path 
        d="M12 16L18 24L18 32M24 16L18 24" 
        stroke={secondaryColor} 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {/* The 'A' */}
      <path 
        d="M32 16L26 32M32 16L38 32M29 24L35 24" 
        stroke={secondaryColor} 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}
