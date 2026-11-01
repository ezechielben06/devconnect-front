// Logo + typographie "DevConnect". L'icône en D jaune remplace le "D" initial du texte.
import React from 'react';
import { DevConnectLogo } from '../DevConnectLogo';

export interface BrandLogoProps {
  collapseOnMobile?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo({ collapseOnMobile = false, className = '', size = 'md' }: BrandLogoProps) {
  const logoPixelSize = size === 'lg' ? 42 : size === 'sm' ? 28 : 34;
  const textSize = size === 'lg' ? 'text-lg sm:text-xl' : size === 'sm' ? 'text-sm' : 'text-base';

  return (
    <div className={`flex items-center gap-1 sm:gap-1.5 select-none group cursor-pointer ${className}`}>
      {/* Logo DevConnect officiel animé formant le D initial */}
      <DevConnectLogo size={logoPixelSize} animated={true} />
      {/* Wordmark typographique evConnect collé au logo D (le D jaune remplace le D noir) */}
      <div className={`flex items-baseline tracking-tight font-black -ml-0.5 sm:-ml-1 ${collapseOnMobile ? 'hidden sm:flex' : 'flex'}`}>
        <span className={`${textSize} text-slate-900 dark:text-white transition-colors duration-200 font-extrabold`}>
          ev
        </span>
        <span className={`${textSize} text-[#F59E0B] font-black ml-0.5`}>
          Connect
        </span>
      </div>
    </div>
  );
}
