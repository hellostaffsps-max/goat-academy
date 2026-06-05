"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getLearningPaths,
  createLearningPath,
  updateLearningPath,
  deleteLearningPath,
} from "@/actions/learning-paths";
import { getLessons } from "@/actions/lessons";
import { Plus, Pencil, Trash2, X, Search, Check, ChevronDown } from "lucide-react";
import type { LearningPathRow, LessonRow } from "@/types/supabase";

const emptyPath = {
  slug: "",
  title: "",
  description: "",
  lessons: [] as string[],
  lesson_count: 0,
  icon: "Coffee",
  color: "from-sky-500 to-blue-600",
  featured: false,
};

const iconOptions = ["Coffee", "Store", "TrendingUp", "BookOpen", "Award", "Star", "Heart", "Zap"];
const colorOptions = [
  { label: "أزرق", value: "from-sky-500 to-blue-600" },
  { label: "أخضر", value: "from-emerald-500 to-teal-600" },
  { label: "برتقالي", value: "from-amber-500 to-orange-600" },
  { label: "أحمر", value: "from-rose-500 to-red-600" },
  { label: "بنفسجي", value: "from-violet-500 to-purple-600" },
  { label: "رمادي", value: "from-slate-500 to-gray-600" },
];

export default function AdminPathsPage() {
  const [paths, setPaths] = useState<LearningPathRow[]>([]);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyPath);
  const [submitting, setSubmitting] = useState(false);
  const [lessonSearch, setLessonSearch] = useState("");
  const [showLessonPicker, setShowLessonPicker] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pathsData, lessonsData] = await Promise.all([
        getLearningPaths(),
        getLessons(),
      ]);
      setPaths(pathsData);
      setLessons(lessonsData);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "فشل تحميل البيانات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredPaths = paths.filter(
    (p) =>
      p.title.includes(search) ||
      p.description.includes(search)
  );

  const filteredLessons = lessons.filter(
    (l) =>
      l.title.includes(lessonSearch) &&
      !form.lessons.includes(l.slug)
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyPath);
    setShowForm(true);
  };

  const openEdit = (path: LearningPathRow) => {
    setEditingId(path.id);
    setForm({
      slug: path.slug,
      title: path.title,
      description: path.description,
      lessons: path.lessons || [],
      lesson_count: path.lesson_count || 0,
      icon: path.icon || "Coffee",
      color: path.color || "from-sky-500 to-blue-600",
      featured: path.featured || false,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyPath);
    setShowLessonPicker(false);
  };

  const addLesson = (slug: string) => {
    setForm((prev) => ({
      ...prev,
      lessons: [...prev.lessons, slug],
      lesson_count: prev.lessons.length + 1,
    }));
  };

  const removeLesson = (slug: string) => {
    setForm((prev) => ({
      ...prev,
      lessons: prev.lessons.filter((l) => l !== slug),
      lesson_count: prev.lessons.length - 1,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateLearningPath(editingId, form);
      } else {
        await createLearningPath(form);
      }
      router.refresh();
      await fetchData();
      closeForm();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || err?.digest || "فشل حفظ المسار");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المسار؟")) return;
    try {
      await deleteLearningPath(id);
      await fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "فشل حذف المسار");
    }
  };

  const selectedLessonTitles = form.lessons
    .map((slug) => lessons.find((l) => l.slug === slug)?.title || slug)
    .filter(Boolean);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث في المسارات..."
            className="w-full pr-9 pl-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          مسار جديد
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
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">العنوان</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">الدروس</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">اللون</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">مميز</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPaths.map((path) => (
                  <tr key={path.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{path.title}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">{path.description}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{path.lesson_count} درس</td>
                    <td className="px-4 py-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${path.color}`} />
                    </td>
                    <td className="px-4 py-3">
                      {path.featured ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(path)}
                          className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(path.id)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPaths.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
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
                {editingId ? "تعديل المسار" : "مسار جديد"}
              </h2>
              <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">الslug</label>
                  <input
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
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
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">الأيقونة</label>
                  <select
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">اللون</label>
                  <select
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {colorOptions.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured-path"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <label htmlFor="featured-path" className="text-sm text-foreground">مميز في الصفحة الرئيسية</label>
              </div>

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

              {/* Lesson Picker */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">الدروس ({form.lessons.length})</label>
                
                {selectedLessonTitles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedLessonTitles.map((title, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {title}
                        <button
                          type="button"
                          onClick={() => removeLesson(form.lessons[idx])}
                          className="hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowLessonPicker(!showLessonPicker)}
                  className="w-full py-2 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-accent/40 hover:text-foreground transition-all"
                >
                  {showLessonPicker ? "إخفاء قائمة الدروس" : "+ إضافة درس للمسار"}
                </button>

                {showLessonPicker && (
                  <div className="mt-2 border border-border rounded-lg p-3 bg-secondary/20">
                    <input
                      type="text"
                      value={lessonSearch}
                      onChange={(e) => setLessonSearch(e.target.value)}
                      placeholder="بحث في الدروس..."
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {filteredLessons.slice(0, 10).map((lesson) => (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => addLesson(lesson.slug)}
                          className="w-full text-right px-3 py-2 rounded-lg text-sm hover:bg-accent/10 transition-colors flex items-center justify-between"
                        >
                          <span>{lesson.title}</span>
                          <Plus className="w-3.5 h-3.5 text-accent" />
                        </button>
                      ))}
                      {filteredLessons.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-2">لا توجد دروس متاحة</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة المسار"}
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
