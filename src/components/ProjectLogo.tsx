import Image from "next/image";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

export function ProjectLogo({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const logo = project.logo;
  const window = logo?.window;
  return (
    <div
      className={cn(
        "relative aspect-square w-20 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-border/50",
        className,
      )}
    >
      {logo ? (
        window ? (
          <Image
            src={logo.src}
            alt={`شعار ${project.name}`}
            width={720}
            height={1640}
            sizes="(max-width: 640px) 160px, 240px"
            className="absolute max-w-none"
            style={{
              width: `${(720 / window.size) * 100}%`,
              height: "auto",
              left: `${(-window.x / window.size) * 100}%`,
              top: `${(-window.y / window.size) * 100}%`,
            }}
          />
        ) : (
          <Image
            src={logo.src}
            alt={`شعار ${project.name}`}
            fill
            sizes="150px"
            className="object-contain"
          />
        )
      ) : (
        <span
          aria-hidden="true"
          className="flex h-full items-center justify-center bg-secondary text-2xl font-bold text-foreground"
        >
          {project.name.replace("مقهى ", "").slice(0, 1)}
        </span>
      )}
    </div>
  );
}
