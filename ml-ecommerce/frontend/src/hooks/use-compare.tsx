import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/lib/types";

interface CompareContextType {
  items: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE = 3;

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Product[]>([]);

  const addToCompare = (product: Product) => {
    setItems((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, product];
    });
  };

  const removeFromCompare = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCompare = () => setItems([]);

  const isInCompare = (id: string) => items.some((p) => p.id === id);

  return (
    <CompareContext.Provider value={{ items, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
};
