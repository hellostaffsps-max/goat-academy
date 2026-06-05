"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getSuccessStories,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
} from "@/actions/success-stories";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Plus, Pencil, Trash2, X, Search, Star } from "lucide-react";
import type { SuccessStoryRow } from "@/types/supabase";

const emptyStory = {
  slug: "",
  title: "",
  description: "",
  content: "",
  location: "",
  image: null as string | null,
  featured: false,
};

export default function AdminSuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyStory);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSuccessStories();
      setStories(data);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "فشل تحميل قصص النجاح");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const filtered = stories.filter(
    (s) =>
      s.title.includes(search) ||
      s.description.includes(search) ||
      s.location.includes(search)
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyStory);
    setShowForm(true);
  };

  const openEdit = (story: SuccessStoryRow) => {
    setEditingId(story.id);
    setForm({
      slug: story.slug,
      title: story.title,
      description: story.description,
      content: story.content,
      location: story.location || "",
      image: story.image,
      featured: story.featured || false,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyStory);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateSuccessStory(editingId, form);
      } else {
        await createSuccessStory(form);
      }
      router.refresh();
      await fetchStories();
      closeForm();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || err?.digest || "فشل حفظ القصة");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه القصة؟")) return;
    try {
      await deleteSuccessStory(id);
      await fetchStories();
    } catch (err) {
      console.error(err);
      alert("فشل حذف القصة");
    }
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
            placeholder="بحث في قصص النجاح..."
            className="w-full pr-9 pl-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          قصة جديدة
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
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">الموقع</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">مميز</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((story) => (
                  <tr key={story.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      {story.image ? (
                        <img src={story.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-xs text-muted-foreground">لا توجد</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{story.title}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">{story.description}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{story.location}</td>
                    <td className="px-4 py-3">
                      {story.featured ? (
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(story)}
                          className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(story.id)}
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
                {editingId ? "تعديل القصة" : "قصة جديدة"}
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
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">الموقع</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  <label htmlFor="featured" className="text-sm text-foreground">مميزة في الصفحة الرئيسية</label>
                </div>
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

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">المحتوى (Markdown)</label>
                <textarea
                  required
                  rows={8}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-xs leading-relaxed"
                />
              </div>

              <ImageUpload
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                folder="success-stories"
                label="صورة القصة"
              />

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة القصة"}
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
