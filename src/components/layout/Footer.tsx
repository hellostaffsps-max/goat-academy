"use client";

import Link from "next/link";
import {
  BookOpen,
  Compass,
  Instagram,
  Linkedin,
  Mail,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

const companyLinks = [
  { href: "/explore", label: "استكشف الدروس" },
  { href: "/paths", label: "مسارات التعلم" },
  { href: "/tools", label: "أدوات القهوة" },
  { href: "/favorites", label: "المفضلة" },
];

const resourceLinks = [
  { href: "/consultant", label: "طلب استشارة" },
  { href: "/settings", label: "إعدادات العرض" },
  { href: "/", label: "عن الأكاديمية" },
  { href: "/", label: "الأسئلة الشائعة" },
];

const socialLinks = [
  { href: "https://instagram.com", label: "انستاغرام", icon: Instagram },
  { href: "https://www.linkedin.com", label: "لينكدإن", icon: Linkedin },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-background/75 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">GoatJourney Academy</p>
                <p className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">أكاديمية القهوة في فلسطين</p>
              </div>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              نقدم محتوى تعليمي متكامل لتطوير مهارات إعداد المشروبات وتشغيل المقاهي بإسلوب عملي وسهل الاستيعاب.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Link
                href="/consultant"
                className="inline-flex items-center justify-center rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
              >
                طلب استشارة الآن
              </Link>
              <Link
                href="/paths"
                className="inline-flex items-center justify-center rounded-2xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/80 hover:text-accent"
              >
                عرض المسارات
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">روابط سريعة</p>
            <div className="space-y-2 text-sm">
              {companyLinks.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className="block transition text-foreground/90 hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">الموارد</p>
            <div className="space-y-2 text-sm">
              {resourceLinks.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className="block transition text-foreground/90 hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">تواصل معنا</p>
            <div className="space-y-3 text-sm text-foreground/90">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                <a href="mailto:hello@goatjourney.com" className="transition hover:text-accent">hello@goatjourney.com</a>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-accent" />
                <a href="https://wa.me/970599123456" target="_blank" rel="noreferrer" className="transition hover:text-accent">
                  دعم واتساب
                </a>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span>خصوصيتك أولويتنا</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-background text-muted-foreground transition hover:border-accent hover:text-accent"
                    aria-label={item.label}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border/50 pt-6 text-sm text-muted-foreground sm:flex sm:items-center sm:justify-between">
          <p>© 2026 GoatJourney Academy. جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-accent" />
            تصميم تجربة تعليمية مهنية ومبتكرة
          </p>
        </div>
      </div>
    </footer>
  );
}
