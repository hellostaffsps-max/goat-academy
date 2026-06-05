"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
} from "@/actions/lessons";
import { categories, learningPaths } from "@/data/coffeeData";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";
import type { LessonRow } from "@/types/supabase";

const difficultyOptions = [
  { value: "beginner", label: "مبتدئ" },
  { value: "intermediate", label: "متوسط" },
  { value: "advanced", label: "متقدم" },
];

const pathOptions = [
  { value: "", label: "بدون مسار" },
  ...learningPaths.map((p) => ({ value: p.id, label: p.title })),
];

const emptyLesson = {
  slug: "",
  title: "",
  category: categories[0].id,
  subcategory: "",
  description: "",
  rating: 4.5,
  tags: [] as string[],
  read_time: "",
  difficulty: "",
  path: "" as string,
  content: "",
  image: null as string | null,
};

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyLesson);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const fetchLessons = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLessons();
      setLessons(data);
    } catch (err) {
      console.error(err);
      alert("فشل تحميل الدروس");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const filtered = lessons.filter(
    (l) =>
      l.title.includes(search) ||
      l.subcategory.includes(search) ||
      l.description.includes(search)
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyLesson);
    setTagInput("");
    setShowForm(true);
  };

  const openEdit = (lesson: LessonRow) => {
    setEditingId(lesson.id);
    setForm({
      slug: lesson.slug,
      title: lesson.title,
      category: lesson.category,
      subcategory: lesson.subcategory,
      description: lesson.description,
      rating: lesson.rating,
      tags: lesson.tags || [],
      read_time: lesson.read_time || "",
      difficulty: lesson.difficulty || "",
      path: lesson.path || "",
      content: lesson.content,
      image: lesson.image,
    });
    setTagInput((lesson.tags || []).join(", "));
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyLesson);
    setTagInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = {
        ...form,
        tags: tagInput.split(",").map((t) => t.trim()).filter(Boolean),
        path: form.path || null,
      };
      if (editingId) {
        await updateLesson(editingId, data);
      } else {
        await createLesson(data);
      }
      router.refresh();
      await fetchLessons();
      closeForm();
    } catch (err: any) {
      console.error("Submit error:", err);
      alert(err?.message || err?.digest || "فشل حفظ الدرس");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الدرس؟")) return;
    try {
      await deleteLesson(id);
      await fetchLessons();
    } catch (err) {
      console.error(err);
      alert("فشل حذف الدرس");
    }
  };

  const getDifficultyLabel = (val?: string | null) => {
    const opt = difficultyOptions.find((o) => o.value === val);
    return opt?.label || val || "—";
  };

  const getDifficultyBadgeColor = (val?: string | null) => {
    switch (val) {
      case "beginner": return "bg-emerald-500/10 text-emerald-700";
      case "intermediate": return "bg-amber-500/10 text-amber-700";
      case "advanced": return "bg-rose-500/10 text-rose-700";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPathLabel = (val?: string | null) => {
    if (!val) return "—";
    const opt = pathOptions.find((o) => o.value === val);
    return opt?.label || val;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث في الدروس..."
            className="w-full pr-9 pl-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          درس جديد
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">جاري التحميل...</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">الصورة</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">العنوان</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">التصنيف</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">المستوى</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">المسار</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">التقييم</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">الوقت</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      {lesson.image ? (
                        <img src={lesson.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-xs text-muted-foreground">لا توجد</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{lesson.title}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">{lesson.description}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{lesson.subcategory}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs ${getDifficultyBadgeColor(lesson.difficulty)}`}>
                        {getDifficultyLabel(lesson.difficulty)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{getPathLabel(lesson.path)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 text-xs">
                        {lesson.rating}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{lesson.read_time}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(lesson)}
                          className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lesson.id)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                      لا توجد نتائج
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-3xl my-8 animate-slide-up">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">
                {editingId ? "تعديل الدرس" : "درس جديد"}
              </h2>
              <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">الslug (رابط الدرس)</label>
                  <input
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="espresso"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">العنوان</label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">التصنيف</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">الفئة الفرعية</label>
                  <input
                    value={form.subcategory}
                    onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">المستوى</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">اختر المستوى...</option>
                    {difficultyOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">المسار التعليمي</label>
                  <select
                    value={form.path}
                    onChange={(e) => setForm({ ...form, path: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {pathOptions.map((o) => (
                      <option key={o.value || "none"} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">الوقت</label>
                  <input
                    value={form.read_time}
                    onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                    placeholder="مثال: 3m"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">التقييم</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">الوسوم (مفصولة بفاصلة)</label>
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="أساسي, متقدم, حلو..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <ImageUpload
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                folder="lessons"
                label="صورة الدرس"
              />

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">الوصف</label>
                <textarea
                  required
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">المحتوى (Markdown)</label>
                <textarea
                  required
                  rows={10}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة الدرس"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
