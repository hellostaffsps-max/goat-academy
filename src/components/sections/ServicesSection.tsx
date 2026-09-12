import Link from "next/link";
import { services } from "@/data/services";
export function ServicesSection() {
  return (
    <section className="section-padding space-y-6" id="services">
      <div>
        <h2 className="heading-lg">خدمات وائل أرزيقات للمقاهي والباريستا</h2>
        <p className="body-base text-muted-foreground mt-3">
          حدد ما يحتاجه مشروعك أو مسارك المهني، واقرأ تفاصيل الخدمة قبل التواصل.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {services.map((s) => (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            className="card-premium p-6 space-y-3"
          >
            <p className="text-xs text-accent" lang="en" dir="ltr">
              {s.englishName}
            </p>
            <h3 className="text-xl font-bold">{s.name}</h3>
            <p className="text-sm leading-7 text-muted-foreground">
              {s.summary}
            </p>
            <span className="block text-accent text-sm">تفاصيل الخدمة ←</span>
          </Link>
        ))}
      </div>
      <Link href="/services" className="btn-accent">
        جميع الخدمات
      </Link>
    </section>
  );
}
