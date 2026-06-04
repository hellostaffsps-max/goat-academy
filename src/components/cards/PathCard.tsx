"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Coffee, Store, TrendingUp } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Coffee, Store, TrendingUp,
};

const colorMap: Record<string, string> = {
  Coffee: "from-amber-500/15 to-orange-500/10 text-amber-600",
  Store: "from-emerald-500/15 to-teal-500/10 text-emerald-600",
  TrendingUp: "from-sky-500/15 to-blue-500/10 text-sky-600",
};

interface PathCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  index?: number;
}

export function PathCard({ icon, title, description, href, index = 0 }: PathCardProps) {
  const Icon = iconMap[icon] || Coffee;
  const colorClass = colorMap[icon] || colorMap.Coffee;

  return (
    <Link
      href={href}
      className="card-premium group p-6 flex flex-col h-full"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
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
