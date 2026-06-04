"use client";

import { Building2 } from "lucide-react";

const clients = [
  { name: "مقهى البن العربي", city: "رام الله", color: "from-amber-600/20 to-amber-800/20 text-amber-700" },
  { name: "لافا كافيه", city: "نابلس", color: "from-rose-600/20 to-rose-800/20 text-rose-700" },
  { name: "روستري التخصص", city: "عمان", color: "from-emerald-600/20 to-emerald-800/20 text-emerald-700" },
  { name: "كافيه نابلس الجديد", city: "نابلس", color: "from-sky-600/20 to-sky-800/20 text-sky-700" },
  { name: "دريب ثرو", city: "القدس", color: "from-violet-600/20 to-violet-800/20 text-violet-700" },
  { name: "ركن قهوة", city: "بيت لحم", color: "from-orange-600/20 to-orange-800/20 text-orange-700" },
  { name: "مقهى ديار", city: "بيرزيت", color: "from-teal-600/20 to-teal-800/20 text-teal-700" },
  { name: "كافيه لمسة", city: "دبي", color: "from-pink-600/20 to-pink-800/20 text-pink-700" },
];

export function ClientLogosSection() {
  return (
    <section className="section-padding overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-3 border border-accent/20">
            <Building2 className="w-3.5 h-3.5" />
            شركاء النجاح
          </div>
          <h2 className="heading-lg mb-2">ثقة 25+ مقهى في فلسطين والوطن العربي</h2>
          <p className="body-base text-muted-foreground max-w-xl mx-auto">
            مقاهٍ ومشاريع ناجحة بنيناها معاً بخبرة وشغف.
          </p>
        </div>

        {/* Marquee */}
        <div className="relative">
          <div className="flex gap-4 animate-marquee whitespace-nowrap">
            {[...clients, ...clients].map((client, i) => (
              <div
                key={`${client.name}-${i}`}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-card border border-border/60 hover:border-accent/30 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${client.color} flex items-center justify-center text-sm font-bold flex-shrink-0`}
                >
                  {client.name.charAt(0)}
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-foreground">{client.name}</div>
                  <div className="text-[10px] text-muted-foreground">{client.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
