"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Calculator, Coffee, TrendingUp } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Calculator, Coffee, TrendingUp,
};

interface ToolCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  index?: number;
}

export function ToolCard({ icon, title, description, href, index = 0 }: ToolCardProps) {
  const Icon = iconMap[icon] || Coffee;

  return (
    <Link
      href={href}
      className="card-premium group p-6 text-center flex flex-col h-full"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
        <Icon className="w-7 h-7 text-accent" />
      </div>

      <h3 className="text-sm font-bold text-foreground mb-1.5 group-hover:text-accent transition-colors">
        {title}
      </h3>

      <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
        {description}
      </p>

      <span className="text-xs font-semibold text-accent inline-flex items-center justify-center gap-1 group-hover:gap-1.5 transition-all mt-auto">
        جربها الآن
        <ArrowLeft className="w-3 h-3" />
      </span>
    </Link>
  );
}
