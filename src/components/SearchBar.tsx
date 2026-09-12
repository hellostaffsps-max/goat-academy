"use client";
import { Search } from "lucide-react";
export function SearchBar() {
  return (
    <form action="/explore" role="search" className="flex items-center gap-1">
      <label htmlFor="site-search" className="sr-only">
        ابحث في دروس القهوة
      </label>
      <input
        id="site-search"
        name="q"
        type="search"
        placeholder="ابحث عن درس"
        className="w-24 sm:w-44 min-w-0 rounded-lg border border-border bg-background px-2 py-2 text-xs"
      />
      <button
        type="submit"
        aria-label="بحث"
        className="p-2 rounded-lg hover:bg-accent/10"
      >
        <Search className="w-4 h-4" />
      </button>
    </form>
  );
}
