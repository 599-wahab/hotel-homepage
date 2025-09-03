// components/footer-context.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

type FooterContextType = {
  image: string | null;
  setImage: (img: string | null) => void;
};

const FooterContext = createContext<FooterContextType | undefined>(undefined);

export function FooterProvider({ children }: { children: React.ReactNode }) {
  const [image, setImage] = useState<string | null>(null);
  return <FooterContext.Provider value={{ image, setImage }}>{children}</FooterContext.Provider>;
}

export function useFooter() {
  const ctx = useContext(FooterContext);
  if (!ctx) {
    throw new Error("useFooter must be used within a FooterProvider");
  }
  return ctx;
}
