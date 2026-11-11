"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Coffee, Store, TrendingUp } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Coffee,
  Store,
  TrendingUp,
};

interface PathCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  index?: number;
}

export function PathCard({
  icon,
  title,
  description,
  href,
  index = 0,
}: PathCardProps) {
  const Icon = iconMap[icon] || Coffee;
  const colorClass = "bg-secondary text-secondary-foreground";

  return (
    <Link
      href={href}
      className="card-premium group p-6 flex flex-col h-full"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div
        className={`w-14 h-14 rounded-lg ${colorClass} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
        {description}
      </p>

      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent group-hover:gap-2.5 transition-all mt-auto">
        استكشف المسار
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
      </span>
    </Link>
  );
}
