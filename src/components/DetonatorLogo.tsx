import React from 'react';

interface DetonatorLogoProps {
  className?: string;
  size?: number | string;
}

export default function DetonatorLogo({ className = '', size }: DetonatorLogoProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 120"
      className={`${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      {/* 1. The Plunger Handle and Shaft ("T") */}
      {/* Wooden/Metal Handle Ends to give it that authentic curved-grip feel */}
      <rect x="22" y="14" width="56" height="8" rx="2" fill="currentColor" />
      <rect x="20" y="10" width="3" height="16" rx="1.5" fill="currentColor" />
      <rect x="77" y="10" width="3" height="16" rx="1.5" fill="currentColor" />
      
      {/* Vertical plunger steel rod (the stem of the T) */}
      <rect x="47" y="22" width="6" height="30" fill="currentColor" />
      
      {/* Base cylinder sleeve/gland collar on the lid */}
      <rect x="44" y="48" width="12" height="4" rx="1" fill="currentColor" />

      {/* 2. Top-mounted electrical binding posts/terminals (very classic detonator look) */}
      <rect x="33" y="47" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="62" y="47" width="5" height="5" rx="1" fill="currentColor" />

      {/* 3. The Solid Lid plate */}
      <rect x="25" y="52" width="50" height="5" rx="1.5" fill="currentColor" />

      {/* 4. The Detonator Box Cabinet ("H") */}
      {/* Left heavy side leg of the H (rugged outer corner support of the box) */}
      <rect x="28" y="57" width="10" height="49" rx="1.5" fill="currentColor" />
      
      {/* Right heavy side leg of the H (rugged outer corner support of the box) */}
      <rect x="62" y="57" width="10" height="49" rx="1.5" fill="currentColor" />
      
      {/* Bold middle linking bar of the H (the crossbar) */}
      <rect x="38" y="78" width="24" height="8" fill="currentColor" />

      {/* 5. Elegant minimalist machine rivet details (knocked out in white) */}
      <circle cx="33" cy="62" r="1.5" fill="white" opacity="0.9" />
      <circle cx="67" cy="62" r="1.5" fill="white" opacity="0.9" />
      <circle cx="33" cy="101" r="1.5" fill="white" opacity="0.9" />
      <circle cx="67" cy="101" r="1.5" fill="white" opacity="0.9" />

      {/* 6. Heavy bottom base chassis platform */}
      <rect x="25" y="106" width="50" height="5" rx="1.5" fill="currentColor" />
    </svg>
  );
}
