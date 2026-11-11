import { requireAdmin } from "@/lib/admin-auth";
import PublishCurriculum from "./publish";
export const dynamic = "force-dynamic";
export const maxDuration = 300;
export default async function CurriculumPage() {
  await requireAdmin();
  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold">مراجعة المنهج — نوفمبر 2026</h1>
      <p>
        مراجعة 112 درسًا وتصحيح الصياغة والحسابات وإزالة أقسام المراجع من العرض.
        تُحفظ الصور والتعديلات غير المتأثرة بالمراجعة.
      </p>
      <p>
        يتوقف النشر عند تعارض محتوى أحدث أو غياب درس سابق، ويعرض اسمه. يمكنك
        إعادة المحاولة؛ التعديلات المطابقة ستُتخطّى.
      </p>
      <PublishCurriculum />
    </main>
  );
}
