"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { revalidatePath, revalidateTag } from "next/cache";
import curriculum from "@/data/reviewedCurriculum.json";
import baseline from "@/data/curriculumBaseline.json";

type Row = Record<string, unknown>;
const same = (a: Row, b: Row, keys: string[]) => keys.every(k => JSON.stringify(a[k] ?? null) === JSON.stringify(b[k] ?? null));

export async function publishReviewedCurriculum() {
  const { supabase } = await requireAdmin();
  let updated = 0;
  let unchanged = 0;
  // Each existing row uses an optimistic lock; retries skip already-applied rows.
  // New rows use insert, never overwrite a conflicting independently-created slug.
  for (const table of ["lessons", "learning_paths"] as const) {
    const target: Row[] = table === "lessons" ? curriculum.lessons : curriculum.paths;
    const previous: Row[] = table === "lessons" ? baseline.lessons : baseline.paths;
    const { data, error } = await supabase.from(table).select("*");
    if (error) throw new Error(error.message);
    const existing = (data || []) as Row[];
    for (const row of target) {
      const current = existing.find(r => r.slug === row.slug);
      const keys = Object.keys(row);
      if (current && same(current, row, keys)) { unchanged++; continue; }
      const prior = previous.find(r => r.slug === row.slug);
      if (current && (!prior || !same(current, prior, keys))) {
        revalidateTag("public-content", { expire: 0 });
        return { ok: false, updated, unchanged, message: `توقفت المراجعة لحماية تعديل أحدث: ${row.slug}. التعديلات السابقة محفوظة ويمكن استئنافها.` };
      }
      if (!current && prior) return { ok: false, updated, unchanged, message: `الدرس أو المسار حُذف بعد النسخ الاحتياطي: ${row.slug}` };
      const query = current
        ? supabase.from(table).update(row).eq("id", current.id).eq("updated_at", current.updated_at).select("id")
        : supabase.from(table).insert(row).select("id");
      const result = await query;
      if (result.error || result.data?.length !== 1) {
        revalidateTag("public-content", { expire: 0 });
        return { ok: false, updated, unchanged, message: `تعذّر حفظ ${row.slug}: ${result.error?.message || "تعديل متزامن؛ أعد الفحص"}` };
      }
      updated++;
    }
  }
  revalidateTag("public-content", { expire: 0 });
  revalidatePath("/sitemap.xml");
  return { ok: true, updated, unchanged, message: "نُشرت مراجعة 112 درسًا والمسارات الخمسة بنجاح." };
}
