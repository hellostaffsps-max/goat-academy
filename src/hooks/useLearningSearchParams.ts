"use client";
import { useMemo, useSyncExternalStore } from "react";

const eventName = "goatjourney:learning-navigation";
const subscribe = (listener: () => void) => {
  window.addEventListener("popstate", listener);
  window.addEventListener(eventName, listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener(eventName, listener);
  };
};
const browserSearch = () => window.location.search;

// A stable server snapshot keeps lesson text rendered for search engines while
// optional learning context is restored after hydration.
export function useLearningSearchParams(initialSearch = "") {
  const search = useSyncExternalStore(
    subscribe,
    browserSearch,
    () => initialSearch,
  );
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const update = (values: Record<string, string | null>) => {
    const next = new URLSearchParams(window.location.search);
    Object.entries(values).forEach(([key, value]) => {
      if (value && value !== "all") next.set(key, value);
      else next.delete(key);
    });
    const query = next.toString();
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
    );
    window.dispatchEvent(new Event(eventName));
  };
  return { params, update };
}
