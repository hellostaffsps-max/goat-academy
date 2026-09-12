import Link from "next/link";
export function ResourcesSection() {
  return (
    <section className="section-padding">
      <div className="card-premium p-8 space-y-5">
        <h2 className="heading-lg">أدلة عملية لمشروع مقهاك</h2>
        <p>
          اقرأ دليل التأسيس ونموذج خطة العمل ومراجع المعدات والتحميص، واحفظ نسخة
          للاستخدام العملي.
        </p>
        <Link href="/downloads" className="btn-premium">
          تصفح المصادر المجانية
        </Link>
      </div>
    </section>
  );
}
