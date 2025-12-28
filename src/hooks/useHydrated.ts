"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if the app has been hydrated on the client.
 * Returns false during SSR and initial render, true after hydration.
 *
 * Use this to prevent hydration mismatches when rendering content
 * that depends on client-side state (localStorage, cookies, etc).
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}

export default useHydrated;
