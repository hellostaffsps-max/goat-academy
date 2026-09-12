import Link from "next/link";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { BreadcrumbSchema } from "@/components/StructuredData";
export default function Page() {
  return (
    <>
      <BreadcrumbSchema
        items={[{ name: "الرئيسية", item: "/" }, { name: "الخدمات" }]}
      />
      <section className="py-12 space-y-5">
        <p className="text-accent">Goat Journey · فلسطين</p>
        <h1 className="heading-xl">
          تدريب الباريستا واستشارات القهوة وتطوير المقاهي
        </h1>
        <p className="body-lg text-muted-foreground">
          مع وائل أرزيقات — Wael Irzeqat. خدمات تبدأ من فهم مستواك أو واقع
          مشروعك، ثم تحديد خطوات عملية يمكن تطبيقها وقياسها.
        </p>
        <Link href="/about" className="text-accent underline">
          تعرف على وائل وطريقة عمله
        </Link>
      </section>
      <ServicesSection />
      <section className="card-premium p-8 space-y-4 mb-8">
        <h2 className="heading-lg">ابدأ بوصف احتياجك</h2>
        <p>
          اذكر المدينة ومرحلة المشروع أو مستواك في تحضير القهوة. ننسق النطاق
          والمواعيد والتكلفة قبل بدء العمل.
        </p>
        <Link href="/consultant" className="btn-premium">
          ناقش مشروعك معنا
        </Link>
      </section>
    </>
  );
}
