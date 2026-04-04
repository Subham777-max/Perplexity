import { useState, useLayoutEffect } from 'react';

/**
 * Hook to detect if the current screen size is mobile
 * Returns true for screens smaller than 768px (md breakpoint in Tailwind)
 * @returns {boolean} - Whether the current screen is mobile
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    // Check initial screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    // Add resize event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup event listener
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};
