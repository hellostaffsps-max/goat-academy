"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>
      <h2 className="text-lg font-bold text-foreground mb-2">
        حدث خطأ غير متوقع
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
        نعتذر عن هذا الخلل. يمكنك المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="bg-primary text-primary-foreground text-xs font-semibold px-5 py-2.5 rounded-lg inline-flex items-center gap-1.5 hover:bg-primary/90 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          إعادة المحاولة
        </button>
        <a
          href="/"
          className="bg-secondary text-secondary-foreground border border-border text-xs font-semibold px-5 py-2.5 rounded-lg inline-flex items-center gap-1.5 hover:bg-secondary/80 transition-colors"
        >
          الصفحة الرئيسية
        </a>
      </div>
      {process.env.NODE_ENV === "development" && (
        <pre className="mt-6 text-[10px] text-left text-muted-foreground bg-secondary/30 p-3 rounded-lg max-w-full overflow-auto border border-border/50">
          {error.message}
          {error.stack}
        </pre>
      )}
    </div>
  );
}
