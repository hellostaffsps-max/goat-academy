"use client";

import { useState } from "react";
import { Mail, CheckCircle2, Sparkles } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="section-padding gradient-hero">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-7 h-7 text-accent" />
        </div>
        <h2 className="heading-lg mb-3">ابقَ على اطلاع</h2>
        <p className="body-base text-muted-foreground mb-6">
          اشترك في النشرة الأسبوعية واحصل على نصائح خاصة، مقالات جديدة، وعروض حصرية.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-4">
          <input
            type="email"
            placeholder="بريدك الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-background/80 backdrop-blur-sm text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-all text-right"
            required
          />
          <button
            type="submit"
            className="btn-premium justify-center whitespace-nowrap"
            disabled={submitted}
          >
            {submitted ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                تم الاشتراك!
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                اشترك الآن
              </>
            )}
          </button>
        </form>

        <p className="text-[10px] text-muted-foreground">
          اشتراكك يعني موافقتك على استلام رسائل بريدية من Goat Journey Academy.
        </p>
      </div>
    </section>
  );
}
