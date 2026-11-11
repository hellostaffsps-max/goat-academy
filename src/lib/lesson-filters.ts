export function normalizeLessonSearch(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي");
}
export function lessonDurationMinutes(
  value: string | null | undefined,
): number | null {
  if (!value) return null;
  const text = value
    .toLowerCase()
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
  const amount = Number.parseFloat(text);
  if (!Number.isFinite(amount)) return null;
  if (/ساع|hour|hr|\bh\b/.test(text)) return amount * 60;
  if (/ثان|second|sec|\bs\b/.test(text)) return amount / 60;
  if (/دق|min|\bm\b/.test(text)) return amount;
  return null;
}
export function matchesLessonDuration(
  value: string | null | undefined,
  filter: string,
) {
  if (filter === "all") return true;
  const duration = lessonDurationMinutes(value);
  if (filter === "unknown") return duration === null;
  if (duration === null) return false;
  return filter === "short"
    ? duration <= 10
    : filter === "medium"
      ? duration > 10 && duration <= 20
      : duration > 20;
}
