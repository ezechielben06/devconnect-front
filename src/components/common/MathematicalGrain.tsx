import React from 'react';

// Astuce : un SVG feTurbulence en inline data-URI au lieu d'un PNG de bruit de 500ko.
// Zéro requête réseau, rendu GPU instantané et adieu le color-banding sur les dalles OLED.

export function MathematicalGrain() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-1 select-none opacity-100"
      aria-hidden="true"
    >
      {/* Couche de texture mathématique procédurale */}
      <div className="mathematical-grain-overlay" />
    </div>
  );
}

export default MathematicalGrain;
