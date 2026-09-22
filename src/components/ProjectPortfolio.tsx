import Link from "next/link";
import { projects } from "@/data/projects";
export function ProjectPortfolio({ service }: { service?: string }) {
  const entries = service ? projects.filter(p => p.services.includes(service === "barista-training-palestine" ? "cafe-staff-training" : service)) : projects;
  return <section className="space-y-6" aria-label="مشاريع وائل أرزيقات">
    <div className="space-y-3"><h2 className="heading-lg">من أعمال وائل أرزيقات في المقاهي</h2>
    <p className="leading-8 text-muted-foreground">مشاريع في تأسيس البار وتطوير المشروبات وتدريب الفرق. يوضح كل ملخص نطاق العمل الذي نفّذه وائل ضمن المشروع.</p></div>
    <div className="grid md:grid-cols-2 gap-5">{entries.map(p => <article key={p.slug} className="card-premium p-6 space-y-4">
      <h3 className="text-xl font-bold"><Link className="underline underline-offset-4" href={`/projects/${p.slug}`}>{p.name}</Link></h3>
      <p className="leading-8">{p.summary}</p>
      <Link className="text-accent underline" href={`/projects/${p.slug}`}>اطلع على نطاق العمل</Link>
    </article>)}</div>
  </section>;
}
