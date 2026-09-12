"use client";
import { createContext, useContext } from "react";
import type { PublicContent } from "@/lib/public-types";
const Context = createContext<PublicContent>({});
export const usePublicContent = () => useContext(Context);
export function PublicContentProvider({
  data,
  children,
}: {
  data: PublicContent;
  children: React.ReactNode;
}) {
  const parent = usePublicContent();
  return (
    <Context.Provider value={{ ...parent, ...data }}>
      {children}
    </Context.Provider>
  );
}
