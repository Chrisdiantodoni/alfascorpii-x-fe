import { useState, useEffect } from "react";

export function useSplashScreen(show = true) {
  const [isReady, setIsReady] = useState(!show);

  useEffect(() => {
    if (!show) {
      setIsReady(true);
    }
  }, [show]);

  return {
    isReady,
    setReady: () => setIsReady(true),
  };
}
