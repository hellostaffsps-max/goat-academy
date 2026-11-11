"use client";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
export function SearchBar() {
  const router = useRouter();
  return (
    <form
      action="/explore"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        const query = String(
          new FormData(event.currentTarget).get("q") || "",
        ).trim();
        router.push(
          query ? `/explore?q=${encodeURIComponent(query)}` : "/explore",
        );
      }}
      className="flex flex-1 sm:flex-none items-center gap-1"
    >
      <label htmlFor="site-search" className="sr-only">
        ابحث في دروس القهوة
      </label>
      <input
        id="site-search"
        name="q"
        type="search"
        placeholder="ابحث عن درس"
        className="w-full sm:w-52 min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-base min-h-11"
      />
      <button
        type="submit"
        aria-label="بحث"
        className="min-h-11 min-w-11 flex items-center justify-center rounded-lg hover:bg-accent/10"
      >
        <Search className="w-4 h-4" />
      </button>
    </form>
  );
}
