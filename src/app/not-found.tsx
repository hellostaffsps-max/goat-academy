import Link from "next/link";
export default function NotFound() {
  return (
    <section className="py-20 text-center space-y-5">
      <h1 className="heading-xl">الصفحة غير موجودة</h1>
      <p>قد يكون الرابط قديماً أو تمت إزالة المحتوى.</p>
      <Link className="btn-premium" href="/courses">
        تصفح دروس القهوة
      </Link>
      <Link className="btn-accent" href="/services">
        خدمات Goat Journey
      </Link>
    </section>
  );
}
