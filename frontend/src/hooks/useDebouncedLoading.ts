import { useState, useEffect, useRef } from 'react';

export const useDebouncedLoading = (isLoading: boolean, delay = 2000) => {
  const [show, setShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isLoading) {
      timerRef.current = setTimeout(() => setShow(true), delay);
    } else {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      setShow(false);
    }
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [isLoading, delay]);

  return show;
};
