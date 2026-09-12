import Link from "next/link";
import { downloadResources } from "@/data/downloadResources";
export default function Downloads() {
  return (
    <section className="space-y-8 py-8">
      <h1 className="heading-xl">مصادر القهوة وتأسيس المقاهي</h1>
      <p className="body-lg text-muted-foreground">
        أدلة عملية يمكنك قراءتها مباشرة أو طباعتها وحفظها من المتصفح.
      </p>
      <div className="grid sm:grid-cols-2 gap-5">
        {Object.entries(downloadResources).map(([slug, r]) => (
          <Link
            key={slug}
            href={`/downloads/${slug}`}
            className="card-premium p-6 space-y-3"
          >
            <h2 className="text-xl font-bold">{r.title}</h2>
            <p>{r.description}</p>
            <span className="text-accent">اقرأ الدليل ←</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
