"use client";

import { Star, MessageSquare } from "lucide-react";

interface StoryCardProps {
  name: string;
  location: string;
  quote: string;
  metric: string;
  index?: number;
}

export function StoryCard({ name, location, quote, metric, index = 0 }: StoryCardProps) {
  return (
    <div
      className="card-premium p-6 relative flex flex-col h-full"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <MessageSquare className="w-8 h-8 text-accent/15 absolute top-5 right-5" />

      <div className="flex items-center gap-1.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
        ))}
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
        &ldquo;{quote}&rdquo;
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
        <div>
          <div className="text-sm font-bold text-foreground">{name}</div>
          <div className="text-[11px] text-muted-foreground">{location}</div>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
          {metric}
        </span>
      </div>
    </div>
  );
}
