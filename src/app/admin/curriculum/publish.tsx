"use client";
import { useState } from "react";
import { publishReviewedCurriculum } from "@/actions/curriculum";
export default function PublishCurriculum() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState("");
  return <div className="space-y-4">
    <button disabled={busy} className="rounded-xl bg-[#382f2c] text-white px-6 py-3 disabled:opacity-50" onClick={async () => {
      setBusy(true); setResult("جارٍ حفظ الدروس والتحقق من كل صف…");
      try { const r = await publishReviewedCurriculum(); setResult(`${r.message} حُفظ: ${r.updated}، مطابق سابقًا: ${r.unchanged}.`); }
      catch (e) { setResult(e instanceof Error ? e.message : "تعذّر النشر. أعد المحاولة بأمان."); }
      finally { setBusy(false); }
    }}>{busy ? "جارٍ النشر…" : "نشر المنهج المراجع"}</button>
    <p role="status" className="whitespace-pre-wrap">{result}</p>
    <a className="underline block" href="/admin/lessons">العودة إلى الدروس</a>
  </div>;
}
