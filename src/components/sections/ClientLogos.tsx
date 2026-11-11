import Link from "next/link";
import { projects } from "@/data/projects";
import { ProjectLogo } from "@/components/ProjectLogo";

export function ClientLogosSection() {
  return (
    <ul
      aria-label="المقاهي التي عمل معها وائل أرزيقات"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
    >
      {projects
        .filter((p) => p.logo)
        .map((p) => (
          <li key={p.slug}>
            <Link
              href={`/success-stories#${p.slug}`}
              className="group flex h-full flex-col items-center gap-4 rounded-2xl border border-border/70 bg-card px-4 py-6 transition-colors hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <ProjectLogo project={p} className="w-20 sm:w-24" />
              <span className="text-center text-sm font-bold text-foreground">
                <bdi>{p.name}</bdi>
              </span>
            </Link>
          </li>
        ))}
    </ul>
  );
}
