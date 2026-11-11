import Link from "next/link";
import { ProjectLogo } from "@/components/ProjectLogo";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { JsonLd, BreadcrumbSchema } from "@/components/StructuredData";
import { absoluteUrl, personId } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return projects
    .filter((p) => p.scope.length > 0)
    .map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  if (!p || !p.scope.length) notFound();
  return pageMetadata(
    `${p.name} — أعمال وائل أرزيقات`,
    p.summary,
    `/projects/${p.slug}`,
  );
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  if (!p || !p.scope.length) notFound();
  return (
    <article className="space-y-10 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${p.name} — أعمال وائل أرزيقات`,
          description: p.summary,
          author: { "@id": personId },
          mainEntityOfPage: absoluteUrl(`/projects/${p.slug}`),
          inLanguage: "ar",
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "الرئيسية", item: "/" },
          { name: "المشاريع", item: "/success-stories" },
          { name: p.name },
        ]}
      />
      <header className="space-y-4">
        <p className="text-accent">Goat Journey / أعمال المقاهي</p>
        <ProjectLogo project={p} className="w-28" />
        <h1 className="heading-xl">
          <bdi>{p.name}</bdi>
        </h1>
        <p className="body-lg">{p.summary}</p>
        <p>
          تنفيذ{" "}
          <Link href="/about" className="underline">
            وائل أرزيقات — Wael Irzeqat
          </Link>
          ، مؤسس Goat Journey.
        </p>
      </header>
      <section className="card-premium p-6 space-y-5">
        <h2 className="heading-lg">نطاق العمل المنفّذ</h2>
        <ul className="list-disc list-inside space-y-4">
          {p.scope.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>
      <p className="text-sm leading-7 text-muted-foreground">
        هذا ملخص مهني من وائل أرزيقات عن مساهمته في المشروع، وليس تقييمًا
        منشورًا باسم المقهى.
      </p>
      <section className="space-y-4">
        <h2 className="heading-lg">خدمات مرتبطة بهذا العمل</h2>
        <ul className="space-y-3">
          {services
            .filter((s) => p.services.includes(s.slug))
            .map((s) => (
              <li key={s.slug}>
                <Link
                  className="underline text-accent"
                  href={`/services/${s.slug}`}
                >
                  {s.name}
                </Link>
              </li>
            ))}
        </ul>
      </section>
      <section className="card-premium p-6 space-y-4">
        <h2 className="heading-lg">هل تعمل على مشروع مقهى؟</h2>
        <p className="leading-8">
          اذكر احتياجات البار والمنيو والفريق لنحدد نطاق العمل المناسب لمشروعك.
        </p>
        <Link href="/consultant" className="btn-premium">
          ناقش مشروعك مع وائل
        </Link>
      </section>
    </article>
  );
}
