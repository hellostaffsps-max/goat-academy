import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectLogo } from "@/components/ProjectLogo";

export function ProjectPortfolio({ service }: { service?: string }) {
  const entries = service
    ? projects.filter((p) =>
        p.services.includes(
          service === "barista-training-palestine"
            ? "cafe-staff-training"
            : service,
        ),
      )
    : projects;
  return (
    <section className="space-y-8" aria-labelledby="portfolio-heading">
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-bold tracking-widest text-accent">
          GOAT JOURNEY / PORTFOLIO
        </p>
        <h2 id="portfolio-heading" className="heading-lg">
          من أعمال وائل أرزيقات
        </h2>
        <p className="leading-8 text-muted-foreground">
          تعاون مع مشاريع المقاهي في تأسيس البار وتطوير المنيو والوصفات وتدريب
          الفرق. لكل مشروع احتياجاته وتجربته.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((p) => (
          <article
            id={p.slug}
            key={p.slug}
            className="card-premium scroll-mt-28 p-6 flex flex-col items-start gap-5"
          >
            <ProjectLogo project={p} className="w-24" />
            <h3 className="text-xl font-bold">
              <bdi>{p.name}</bdi>
            </h3>
            {p.scope.length > 0 ? (
              <>
                <p className="text-sm leading-7 text-muted-foreground">
                  {p.summary}
                </p>
                <Link
                  className="mt-auto inline-flex items-center gap-2 py-2 text-sm font-semibold text-accent underline underline-offset-4"
                  href={`/projects/${p.slug}`}
                >
                  تفاصيل العمل{" "}
                  <ArrowUpLeft aria-hidden="true" className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <p className="text-sm leading-7 text-muted-foreground">
                من مشاريع وائل أرزيقات
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
