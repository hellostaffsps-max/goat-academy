"use client";

import { Lightbulb, AlertTriangle, Briefcase, ChefHat, XCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoBoxProps {
  children: React.ReactNode;
  className?: string;
}

export function TipBox({ children, className }: InfoBoxProps) {
  return (
    <div className={cn(
      "my-4 p-4 rounded-xl border bg-amber-50/60 border-amber-200 text-right",
      className
    )}>
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span className="text-xs font-bold text-amber-800">نصيحة</span>
      </div>
      <div className="text-sm text-amber-900/80 leading-relaxed">{children}</div>
    </div>
  );
}

export function WarningBox({ children, className }: InfoBoxProps) {
  return (
    <div className={cn(
      "my-4 p-4 rounded-xl border bg-red-50/60 border-red-200 text-right",
      className
    )}>
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
        <span className="text-xs font-bold text-red-800">تحذير</span>
      </div>
      <div className="text-sm text-red-900/80 leading-relaxed">{children}</div>
    </div>
  );
}

export function CafeTipBox({ children, className }: InfoBoxProps) {
  return (
    <div className={cn(
      "my-4 p-4 rounded-xl border bg-blue-50/60 border-blue-200 text-right",
      className
    )}>
      <div className="flex items-center gap-2 mb-2">
        <Briefcase className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span className="text-xs font-bold text-blue-800">نصيحة للمقاهي</span>
      </div>
      <div className="text-sm text-blue-900/80 leading-relaxed">{children}</div>
    </div>
  );
}

export function RecipeBox({ children, className }: InfoBoxProps) {
  return (
    <div className={cn(
      "my-4 p-4 rounded-xl border bg-emerald-50/60 border-emerald-200 text-right",
      className
    )}>
      <div className="flex items-center gap-2 mb-2">
        <ChefHat className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span className="text-xs font-bold text-emerald-800">الوصفة المرجعية</span>
      </div>
      <div className="text-sm text-emerald-900/80 leading-relaxed">{children}</div>
    </div>
  );
}

export function MistakeBox({ children, className }: InfoBoxProps) {
  return (
    <div className={cn(
      "my-4 p-4 rounded-xl border bg-rose-50/60 border-rose-200 text-right",
      className
    )}>
      <div className="flex items-center gap-2 mb-2">
        <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
        <span className="text-xs font-bold text-rose-800">خطأ شائع</span>
      </div>
      <div className="text-sm text-rose-900/80 leading-relaxed">{children}</div>
    </div>
  );
}

export function DidYouKnowBox({ children, className }: InfoBoxProps) {
  return (
    <div className={cn(
      "my-4 p-4 rounded-xl border bg-violet-50/60 border-violet-200 text-right",
      className
    )}>
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-4 h-4 text-violet-600 flex-shrink-0" />
        <span className="text-xs font-bold text-violet-800">هل تعلم؟</span>
      </div>
      <div className="text-sm text-violet-900/80 leading-relaxed">{children}</div>
    </div>
  );
}

export function SuccessBox({ children, className }: InfoBoxProps) {
  return (
    <div className={cn(
      "my-4 p-4 rounded-xl border bg-green-50/60 border-green-200 text-right",
      className
    )}>
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
        <span className="text-xs font-bold text-green-800">الحل</span>
      </div>
      <div className="text-sm text-green-900/80 leading-relaxed">{children}</div>
    </div>
  );
}
