"use client";

import { useState, useEffect } from "react";
import { X, Gift, MessageSquare, Users } from "lucide-react";

const STORAGE_KEY = "exit-intent-shown";
const SESSION_KEY = "exit-intent-session";

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    // Show only once per session (not persisted across browser restarts)
    const sessionShown = sessionStorage.getItem(SESSION_KEY);
    if (sessionShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !sessionStorage.getItem(SESSION_KEY)) {
        setIsVisible(true);
        sessionStorage.setItem(SESSION_KEY, "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    const message = encodeURIComponent(
      `مرحباً، أود الحصول على دليل تأسيس المقهى المجاني. رقمي: ${phone}`
    );
    window.open(`https://wa.me/970594136723?text=${message}`, "_blank");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={() => setIsVisible(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-popup-title"
    >
      <div
        className="relative bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-slide-up text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 left-3 w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Content */}
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mx-auto">
            <Gift className="w-7 h-7 text-accent" />
          </div>

          <div>
            <h3 id="exit-popup-title" className="text-lg font-bold text-foreground mb-1">
              🚀 انتظر! قبل أن تغادر...
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              احصل على <strong className="text-foreground">دليل تأسيس المقهى المجاني</strong> —
              20 صفحة من النصائح العملية والخطوات
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="رقم الواتساب (مثال: 059XXXXXXX)"
              required
              dir="ltr"
              className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-accent transition-colors text-left"
            />
            <button
              type="submit"
              className="w-full bg-accent text-accent-foreground text-xs font-bold py-3 px-4 rounded-xl inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <MessageSquare className="w-4 h-4" />
              احصل على الدليل المجاني
            </button>
          </form>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>500+ شخص حصلوا على الدليل</span>
          </div>
        </div>
      </div>
    </div>
  );
}
