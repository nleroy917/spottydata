import { useEffect, useRef } from 'react'

export const useInterval = (callback: Function, delay: number) => {
    const savedCallback = useRef<Function>();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        if(savedCallback.current) {
            savedCallback.current();
        }
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }