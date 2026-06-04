"use client";

import { Download, FileText } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, Download,
};

interface ResourceCardProps {
  icon: string;
  title: string;
  description: string;
  pages: string;
  index?: number;
}

export function ResourceCard({ icon, title, description, pages, index = 0 }: ResourceCardProps) {
  const Icon = iconMap[icon] || FileText;

  return (
    <div
      className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/60 hover:border-accent/30 transition-all group cursor-pointer"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
        <Icon className="w-5 h-5 text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-1">{description}</p>
        <span className="text-[10px] text-accent font-medium">{pages}</span>
      </div>
      <Download className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-accent transition-colors" />
    </div>
  );
}
