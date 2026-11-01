import React, { useState } from 'react';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'available' | 'busy' | 'open_to_offers' | null;
  className?: string;
}

export function Avatar({
  src,
  name,
  size = 'md',
  status = null,
  className = '',
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg font-bold',
  }[size];

  // Calcul des initiales (ex: Narcisse Avlessi -> NA)
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'DC';

  return (
    <div className={`relative inline-block shrink-0 ${sizeClasses} ${className}`}>
      {src && !imageError ? (
        <img
          src={src}
          alt={`Photo de profil de ${name}`}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImageError(true)}
          className="w-full h-full rounded-full object-cover border border-slate-300 dark:border-slate-800 shadow-sm"
        />
      ) : (
        <div
          aria-label={name}
          className="w-full h-full rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br from-[#0066FF] to-slate-900 border border-slate-300 dark:border-slate-700 select-none shadow-sm"
        >
          {initials}
        </div>
      )}

      {/* Indicateur de disponibilité */}
      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-2 ring-white dark:ring-[#050811] ${
            size === 'xs' || size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'
          } ${
            status === 'available'
              ? 'bg-emerald-500'
              : status === 'busy'
              ? 'bg-rose-500'
              : 'bg-amber-500'
          }`}
          title={status === 'available' ? 'Disponible' : status === 'busy' ? 'Occupé' : 'À l\'écoute'}
        />
      )}
    </div>
  );
}
