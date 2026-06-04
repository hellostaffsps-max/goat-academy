"use client";

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:right-0 focus:z-[100] 
                 focus:bg-accent focus:text-accent-foreground focus:px-4 focus:py-2 
                 focus:text-xs focus:font-medium focus:rounded-bl-lg
                 transition-all"
    >
      تخطي إلى المحتوى الرئيسي
    </a>
  );
}
