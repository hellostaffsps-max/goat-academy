import { requireAdmin } from "@/lib/admin-auth";
import PublishCurriculum from "./publish";
export const dynamic = "force-dynamic";
export const maxDuration = 300;
export default async function CurriculumPage() {
  await requireAdmin();
  return <main className="p-6 max-w-3xl mx-auto space-y-6" dir="rtl">
    <h1 className="text-3xl font-bold">مراجعة المنهج — سبتمبر 2026</h1>
    <p>تصحيح 100 درس وإضافة 12 درسًا، مراجع وتمارين ورسومات تعليمية، وترتيب المسارات الخمسة. يحتفظ النشر بالروابط والصورة المرفوعة سابقًا، ويتوقف عند اكتشاف تعديل أحدث لحمايته.</p>
    <p>النسخة الأصلية محفوظة قبل المراجعة. يمكنك إعادة المحاولة؛ الدروس التي نُشرت بالفعل ستُتخطّى.</p>
    <PublishCurriculum />
  </main>;
}
