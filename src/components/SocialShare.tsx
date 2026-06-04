"use client";

import { usePathname } from "next/navigation";
import { Share2, X, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SocialShareProps {
  title: string;
  url?: string;
  className?: string;
}

const shareLinks = [
  {
    name: "واتساب",
    color: "bg-[#25D366] text-white hover:bg-[#128C7E]",
    icon: MessageCircle,
    getUrl: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(title + "\n" + url)}`,
  },
  {
    name: "فيسبوك",
    color: "bg-[#1877F2] text-white hover:bg-[#166fe5]",
    icon: () => (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "تويتر",
    color: "bg-black text-white hover:bg-gray-800",
    icon: () => (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: "لينكدإن",
    color: "bg-[#0A66C2] text-white hover:bg-[#004182]",
    icon: () => (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    getUrl: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "تلغرام",
    color: "bg-[#0088cc] text-white hover:bg-[#0077b3]",
    icon: Send,
    getUrl: (url: string, title: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
];

export function SocialShare({ title, url, className }: SocialShareProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const fullUrl = url || `https://www.goatjourney.online${pathname}`;

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-accent transition-colors"
        aria-label="مشاركة المحتوى"
        aria-expanded={isOpen}
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>مشاركة</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-20 bg-card border border-border rounded-xl p-2 shadow-lg flex gap-1.5 animate-fade-in">
          {shareLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.getUrl(fullUrl, title)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110",
                  link.color
                )}
                aria-label={`مشاركة على ${link.name}`}
                title={link.name}
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            aria-label="إغلاق قائمة المشاركة"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      )}
    </div>
  );
}
