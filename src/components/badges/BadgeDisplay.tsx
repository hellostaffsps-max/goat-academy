"use client";

import { badges, getBadgeById } from "@/lib/badges";
import { useStore } from "@/store/useStore";
import { Award, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function BadgeCollection() {
  const { hasBadge } = useStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-right">
        <Award className="w-5 h-5 text-accent" />
        <h3 className="text-sm font-bold text-foreground">الشارات والإنجازات</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {badges.map((badge) => {
          const earned = hasBadge(badge.id);
          return (
            <div
              key={badge.id}
              className={cn(
                "relative p-3 rounded-xl border text-center transition-all",
                earned
                  ? `${badge.color} opacity-100 scale-100`
                  : "bg-secondary/30 border-border/40 opacity-60 grayscale"
              )}
            >
              {!earned && (
                <div className="absolute top-2 left-2">
                  <Lock className="w-3 h-3 text-muted-foreground/50" />
                </div>
              )}
              <div className="text-2xl mb-1">{badge.icon}</div>
              <h4 className="text-[11px] font-bold text-foreground leading-tight">
                {badge.title}
              </h4>
              <p className="text-[9px] text-muted-foreground mt-1 leading-relaxed">
                {badge.description}
              </p>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-muted-foreground text-center">
        أكمل الدروس والاختبارات لكسب المزيد من الشارات
      </p>
    </div>
  );
}

export function BadgeNotification({
  badgeId,
  onClose,
}: {
  badgeId: string;
  onClose: () => void;
}) {
  const badge = getBadgeById(badgeId);
  if (!badge) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div
        className={cn(
          "p-4 rounded-xl border shadow-lg text-right",
          badge.color
        )}
      >
        <div className="flex items-center gap-3">
          <div className="text-3xl">{badge.icon}</div>
          <div className="flex-1">
            <p className="text-xs font-bold text-foreground">
              مبروك! حصلت على شارة جديدة
            </p>
            <p className="text-sm font-bold text-foreground mt-0.5">
              {badge.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
