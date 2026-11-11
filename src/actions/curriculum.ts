"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { revalidatePath, revalidateTag } from "next/cache";
import curriculum from "@/data/reviewedCurriculum.json";
import previousReview from "@/data/curriculumPreviousReview.json";
import baseline from "@/data/curriculumBaseline.json";
import { planCurriculumUpdate } from "@/lib/curriculum-update";

type Row = Record<string, unknown>;
export async function publishReviewedCurriculum() {
  const { supabase } = await requireAdmin();
  let updated = 0;
  let unchanged = 0;
  const stop = (message: string) => {
    revalidateTag("public-content", { expire: 0 });
    return { ok: false, updated, unchanged, message };
  };
  for (const table of ["lessons", "learning_paths"] as const) {
    const key = table === "lessons" ? "lessons" : "paths";
    const target: Row[] = curriculum[key];
    const revisions: Row[][] = [previousReview[key], baseline[key]];
    const { data, error } = await supabase.from(table).select("*");
    if (error) throw new Error(error.message);
    const existing = (data || []) as Row[];
    for (const row of target) {
      const current = existing.find((r) => r.slug === row.slug);
      const priors = revisions.flatMap((rows) =>
        rows.filter((r) => r.slug === row.slug),
      );
      if (!current) {
        // A missing previously reviewed row may have been deliberately deleted.
        return stop(
          `لم يُنشر ${row.slug}: غير موجود حاليًا. راجعه في الإدارة قبل استعادته.`,
        );
      }
      const { patch, conflicts } = planCurriculumUpdate(current, row, priors);
      if (conflicts.length)
        return stop(
          `توقفت المراجعة لحماية تعديل أحدث: ${row.slug} (${conflicts.join("، ")}). ما سبق حفظه باقٍ ويمكن استئناف النشر.`,
        );
      if (!Object.keys(patch).length) {
        unchanged++;
        continue;
      }
      if (typeof current.updated_at !== "string")
        return stop(`تعذّر التحقق من تاريخ تعديل ${row.slug}.`);
      // Optimistic locking also protects edits made while the publication is running.
      const result = await supabase
        .from(table)
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq("id", current.id)
        .eq("updated_at", current.updated_at)
        .select("id");
      if (result.error || result.data?.length !== 1)
        return stop(
          `تعذّر حفظ ${row.slug}: ${result.error?.message || "تعديل متزامن؛ أعد الفحص"}`,
        );
      updated++;
    }
  }
  revalidateTag("public-content", { expire: 0 });
  revalidatePath("/sitemap.xml");
  return {
    ok: true,
    updated,
    unchanged,
    message: `نُشرت مراجعة ${curriculum.lessons.length} درسًا بنجاح.`,
  };
}
