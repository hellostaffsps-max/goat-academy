import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { ClientLogosSection } from "./ClientLogos";

export function SuccessStoriesSection() {
  const featured = projects.filter((p) =>
    ["farran", "re-coffee", "mariam"].includes(p.slug),
  );
  return (
    <section
      id="stories"
      className="section-padding border-y border-border/60 bg-secondary/30"
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-bold tracking-widest text-accent">
              من أعمال وائل أرزيقات
            </p>
            <h2 className="heading-lg">مشاريع ناجحة بنيناها معاً</h2>
            <p className="body-base text-muted-foreground">
              من فكرة البار إلى تفاصيل الكوب. مقاهٍ شاركنا في رحلتها، ولكل منها
              هويتها وقصتها.
            </p>
          </div>
          <Link
            href="/success-stories"
            className="btn-premium inline-flex self-start md:shrink-0"
          >
            اكتشف أعمال وائل{" "}
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <ClientLogosSection />
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((p) => (
            <article
              key={p.slug}
              className="border-t-2 border-accent pt-5 space-y-3"
            >
              <h3 className="text-lg font-bold">
                <Link href={`/projects/${p.slug}`} className="hover:underline">
                  <bdi>{p.name}</bdi>
                </Link>
              </h3>
              <p className="text-sm leading-7 text-muted-foreground">
                {p.summary}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
