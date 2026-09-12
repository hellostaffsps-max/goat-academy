import Image from "next/image";
import Link from "next/link";
import { JsonLd, BreadcrumbSchema } from "@/components/StructuredData";
import { absoluteUrl, personId } from "@/lib/site";
export default function About() {
  return (
    <article className="space-y-12 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          url: absoluteUrl("/about"),
          mainEntity: { "@id": personId },
          name: "وائل أرزيقات — Wael Irzeqat",
        }}
      />
      <BreadcrumbSchema
        items={[{ name: "الرئيسية", item: "/" }, { name: "وائل أرزيقات" }]}
      />
      <header className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <p className="text-accent">مؤسس Goat Journey</p>
          <h1 className="heading-xl">
            وائل أرزيقات
            <span lang="en" dir="ltr" className="block text-2xl mt-3">
              Wael Irzeqat
            </span>
          </h1>
          <p className="body-lg">
            مدرب واستشاري قهوة مختصة يعمل على تدريب الباريستا وتطوير المقاهي
            وتصميم قوائم المشروبات في فلسطين.
          </p>
          <Link className="btn-premium" href="/services">
            تعرف على خدماتي
          </Link>
        </div>
        <Image
          src="/images/founder.webp"
          alt="وائل أرزيقات — Wael Irzeqat، مؤسس Goat Journey"
          width={600}
          height={750}
          sizes="(max-width: 768px) 100vw, 450px"
          className="rounded-3xl w-full max-w-sm mx-auto"
          priority
        />
      </header>
      <section className="space-y-4 max-w-3xl">
        <h2 className="heading-lg">من المعرفة إلى العمل خلف البار</h2>
        <p className="leading-8">
          تجمع تجربة وائل بين تحضير القهوة وتشغيل المقاهي وتدريب فرق الباريستا.
          يركز عمله على فهم الوصفة وتكرارها، تنظيم العمل، وربط قرارات المعدات
          والمنيو باحتياجات المشروع.
        </p>
        <p className="leading-8">
          تقدم Goat Journey محتوى عربياً في القهوة المختصة، إلى جانب خدمات
          التدريب والاستشارة. الدروس والأدلة تساعد على التعلم والاستعداد؛ ويحدد
          التدريب العملي والاستشارات بحسب مستوى المتدرب أو ظروف المقهى.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="heading-lg">مجالات العمل</h2>
        <ul className="list-disc list-inside space-y-3">
          <li>تدريب الباريستا على تحضير المشروبات وضبط الجودة.</li>
          <li>تطوير فرق المقاهي وإجراءات العمل والتشغيل.</li>
          <li>مراجعة احتياجات التجهيز وتنظيم البار.</li>
          <li>تطوير وصفات المشروبات والمنيو وتكلفة المكونات.</li>
        </ul>
      </section>
      <section className="space-y-4">
        <h2 className="heading-lg">طريقة العمل</h2>
        <p className="leading-8">
          تبدأ كل مهمة بفهم الهدف والمعلومات المتاحة. نحدد النطاق والمخرجات
          والترتيبات قبل بدء التنفيذ، ونستخدم الأمثلة والممارسة والملاحظات
          العملية للوصول إلى خطوات واضحة.
        </p>
        <p className="leading-8">
          للاستفسار عن برنامج تدريبي أو مؤهلات مطلوبة لجهة عملك، اذكر متطلباتك
          عند التواصل حتى تتضح التفاصيل قبل الحجز.
        </p>
        <Link href="/success-stories" className="text-accent underline">
          اطلع على المشاريع والتجارب المنشورة
        </Link>
      </section>
      <section className="card-premium p-8 space-y-4">
        <h2 className="heading-lg">لنتحدث عن مشروعك</h2>
        <p>اذكر مدينتك ومرحلة مشروعك أو المهارة التي تريد تطويرها.</p>
        <Link href="/consultant" className="btn-premium">
          تواصل مع وائل
        </Link>
      </section>
    </article>
  );
}
