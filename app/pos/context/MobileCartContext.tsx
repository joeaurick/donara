"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

type MobileCartContextType = {
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const MobileCartContext =
  createContext<MobileCartContextType | null>(null);

export function MobileCartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <MobileCartContext.Provider
      value={{
        open,
        openCart: () => setOpen(true),
        closeCart: () => setOpen(false),
      }}
    >
      {children}
    </MobileCartContext.Provider>
  );
}

export function useMobileCart() {
  const context = useContext(MobileCartContext);

  if (!context) {
    throw new Error(
      "useMobileCart harus berada di dalam MobileCartProvider"
    );
  }

  return context;
}