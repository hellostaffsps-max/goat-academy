"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

// Host rewrites can expose a different path to prerendering than the browser.
// Keep path-dependent navigation identical on the server and first hydration;
// Next's pathname subscription updates the small navigation UI after mounting.
export function useClientPathname() {
  const pathname = usePathname();
  const hydrated = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  return hydrated ? pathname : "";
}
