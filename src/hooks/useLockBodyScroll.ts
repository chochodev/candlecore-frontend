import { useLayoutEffect } from "react";

/**
 * Custom hook to lock/unlock body scroll
 * @param {boolean} lock - true to lock scroll, false to unlock
 */
export function useLockBodyScroll(lock: boolean) {
  useLayoutEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    if (lock) {
      document.body.style.overflow = "hidden"; // Disable scroll
    } else {
      document.body.style.overflow = originalStyle; // Restore scroll
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [lock]);
}

export default useLockBodyScroll;
