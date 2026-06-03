"use client";

import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import { useState, useEffect } from "react";

export function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border/60 shadow-lg animate-slide-up">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
            🚀 ابدأ رحلتك في عالم القهوة المختصة
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
            احجز استشارة مجانية الآن واحصل على خطة مخصصة لمشروعك.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/consultant"
            className="btn-premium text-xs py-2 px-4"
          >
            احجز استشارة
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="w-8 h-8 rounded-lg hover:bg-accent/10 flex items-center justify-center transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
