"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface ShippingConfig {
  freeShippingThreshold: number;
  shippingCost: number;
}

const defaults: ShippingConfig = {
  freeShippingThreshold: 500,
  shippingCost: 49.9,
};

const ShippingConfigContext = createContext<ShippingConfig>(defaults);

export function ShippingConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ShippingConfig>(defaults);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.freeShippingThreshold && data.shippingCost) {
          setConfig({
            freeShippingThreshold: data.freeShippingThreshold,
            shippingCost: data.shippingCost,
          });
        }
      })
      .catch(() => {
        // Defaults already set
      });
  }, []);

  return (
    <ShippingConfigContext.Provider value={config}>
      {children}
    </ShippingConfigContext.Provider>
  );
}

export function useShippingConfig() {
  return useContext(ShippingConfigContext);
}
