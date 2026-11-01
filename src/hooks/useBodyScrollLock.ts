import { useEffect } from 'react';

// Bloque le scroll du body à l'ouverture d'une modale.
// Compteur de réf pour gérer l'empilement sans casser le scroll au unmount de la première modale.
let activeLocksCount = 0;
let originalBodyOverflow = '';
let originalDocOverflow = '';
let originalBodyTouchAction = '';

export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    if (activeLocksCount === 0) {
      originalBodyOverflow = document.body.style.overflow;
      originalDocOverflow = document.documentElement.style.overflow;
      originalBodyTouchAction = document.body.style.touchAction;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    }
    activeLocksCount++;

    return () => {
      activeLocksCount--;
      if (activeLocksCount <= 0) {
        activeLocksCount = 0;
        document.body.style.overflow = originalBodyOverflow || '';
        document.documentElement.style.overflow = originalDocOverflow || '';
        document.body.style.touchAction = originalBodyTouchAction || '';
      }
    };
  }, [isLocked]);
}
