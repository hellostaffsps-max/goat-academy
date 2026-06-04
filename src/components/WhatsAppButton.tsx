"use client";

import { MessageSquare } from "lucide-react";

const WHATSAPP_NUMBER = "+970594136723";
const WHATSAPP_MESSAGE = "مرحباً، أود الاستفسار عن خدمات Goat Journey Academy";

export function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-50 w-12 h-12 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 flex items-center justify-center"
      aria-label="تواصل عبر واتساب"
    >
      <MessageSquare className="w-6 h-6" />
    </a>
  );
}
