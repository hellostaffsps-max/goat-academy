import Image from "next/image";
import Link from "next/link";
export function FounderSection() {
  return (
    <section
      className="section-padding grid md:grid-cols-2 gap-8 items-center"
      id="about"
    >
      <Image
        src="/images/founder.webp"
        width={480}
        height={600}
        sizes="(max-width: 768px) 100vw, 440px"
        alt="وائل أرزيقات — Wael Irzeqat"
        className="rounded-3xl w-full max-w-sm mx-auto"
      />
      <div className="space-y-5">
        <p className="text-accent">مؤسس Goat Journey</p>
        <h2 className="heading-lg">وائل أرزيقات — Wael Irzeqat</h2>
        <p className="body-base leading-8 text-muted-foreground">
          مدرب واستشاري قهوة مختصة في فلسطين. يركز عمله على تطوير مهارات
          الباريستا وتشغيل المقاهي وتصميم المشروبات وبناء طرق عمل واضحة للفريق.
        </p>
        <p className="leading-8">
          تجمع Goat Journey بين الدروس العربية والخدمات العملية، لمساعدة المتدرب
          وصاحب المقهى على تحديد الخطوة المناسبة.
        </p>
        <Link href="/about" className="btn-accent">
          تعرف على وائل
        </Link>
      </div>
    </section>
  );
}
