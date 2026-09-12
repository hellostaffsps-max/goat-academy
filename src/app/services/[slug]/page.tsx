import Link from "next/link";
import { notFound } from "next/navigation";
import { services, getService } from "@/data/services";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl, organizationId } from "@/lib/site";
import { JsonLd, BreadcrumbSchema } from "@/components/StructuredData";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }: Props) {
  const s = getService((await params).slug);
  if (!s) notFound();
  return pageMetadata(
    `${s.name} | ${s.englishName}`,
    s.summary,
    `/services/${s.slug}`,
  );
}
export default async function ServicePage({ params }: Props) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const request = `/consultant?service=${s.slug}`;
  return (
    <article className="space-y-12 pb-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": absoluteUrl(`/services/${s.slug}#service`),
          name: s.name,
          alternateName: s.englishName,
          description: s.summary,
          url: absoluteUrl(`/services/${s.slug}`),
          serviceType: s.englishName,
          provider: { "@id": organizationId },
          areaServed: { "@type": "Country", name: "Palestine" },
          mainEntityOfPage: absoluteUrl(`/services/${s.slug}`),
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: "الرئيسية", item: "/" },
          { name: "الخدمات", item: "/services" },
          { name: s.name },
        ]}
      />
      <header className="py-10 space-y-5">
        <p className="text-accent" lang="en" dir="ltr">
          {s.englishName}
        </p>
        <h1 className="heading-xl">{s.name}</h1>
        <p className="body-lg text-muted-foreground max-w-3xl">{s.summary}</p>
        <p>
          مع{" "}
          <Link href="/about" className="underline">
            وائل أرزيقات — Wael Irzeqat
          </Link>
          ، مؤسس Goat Journey.
        </p>
        <Link href={request} className="btn-premium">
          ناقش احتياجك لهذه الخدمة
        </Link>
      </header>
      <section className="space-y-4">
        <h2 className="heading-lg">لمن هذه الخدمة؟</h2>
        <p className="body-base leading-8">{s.audience}</p>
      </section>
      <section className="space-y-5">
        <h2 className="heading-lg">كيف نعمل معك؟</h2>
        <ol className="grid md:grid-cols-3 gap-5">
          {s.steps.map((step, i) => (
            <li key={step.title} className="card-premium p-6 space-y-4">
              <span className="text-accent text-2xl">0{i + 1}</span>
              <h3 className="text-lg font-bold">{step.title}</h3>
              <p className="text-sm leading-7 text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>
      <section className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="heading-lg">ما الذي نحدد تسليمه؟</h2>
          <ul className="list-disc list-inside space-y-3">
            {s.deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div className="card-premium p-6 space-y-4">
          <h2 className="text-xl font-bold">قبل التواصل</h2>
          <p className="leading-8 text-muted-foreground">{s.preparation}</p>
        </div>
      </section>
      <section className="space-y-5">
        <h2 className="heading-lg">أسئلة شائعة</h2>
        {s.faqs.map((f) => (
          <div
            key={f.question}
            className="border-b border-border pb-5 space-y-2"
          >
            <h3 className="text-lg font-semibold">{f.question}</h3>
            <p className="leading-8 text-muted-foreground">{f.answer}</p>
          </div>
        ))}
      </section>
      <section className="space-y-4">
        <h2 className="heading-lg">مصادر تساعدك على الاستعداد</h2>
        <ul className="space-y-3">
          {s.relatedLessons.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-accent underline">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/success-stories" className="text-accent underline">
              مشاريع وتجارب Goat Journey
            </Link>
          </li>
        </ul>
      </section>
      <section className="card-premium p-8 space-y-4">
        <h2 className="heading-lg">لنحدد الخطوة المناسبة لك</h2>
        <p>
          أرسل مدينتك واحتياجك، وسنناقش تفاصيل الخدمة والنطاق المناسب قبل الحجز.
        </p>
        <Link href={request} className="btn-premium">
          تواصل بخصوص {s.name}
        </Link>
      </section>
      <nav aria-label="خدمات ذات صلة" className="space-y-3">
        <h2 className="text-xl font-bold">خدمات أخرى</h2>
        <div className="flex flex-wrap gap-4">
          {services
            .filter((x) => x.slug !== s.slug)
            .map((x) => (
              <Link
                className="underline text-accent"
                key={x.slug}
                href={`/services/${x.slug}`}
              >
                {x.name}
              </Link>
            ))}
        </div>
      </nav>
    </article>
  );
}
