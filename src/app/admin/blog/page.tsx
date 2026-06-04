"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "@/actions/articles";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";
import type { ArticleRow } from "@/types/supabase";

const emptyArticle = {
  slug: "",
  title: "",
  description: "",
  content: "",
  category: "tips",
  category_label: "💡 نصائح سريعة",
  tags: [] as string[],
  read_time: "5 دقائق",
  date: new Date().toISOString().split("T")[0],
  author: "وائل أرزيقات",
  image: null as string | null,
};

const categoryOptions = [
  { value: "news", label: "📰 أخبار القهوة" },
  { value: "success", label: "🏆 قصص النجاح" },
  { value: "tips", label: "💡 نصائح سريعة" },
  { value: "case-study", label: "📊 دراسات حالة" },
  { value: "exploration", label: "🌍 رحلات استكشاف" },
];

export default function AdminBlogPage() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyArticle);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      console.error(err);
      alert("فشل تحميل المقالات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const filtered = articles.filter(
    (a) =>
      a.title.includes(search) ||
      a.description.includes(search) ||
      a.category_label.includes(search)
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyArticle);
    setTagInput("");
    setShowForm(true);
  };

  const openEdit = (article: ArticleRow) => {
    setEditingId(article.id);
    setForm({
      slug: article.slug,
      title: article.title,
      description: article.description,
      content: article.content,
      category: article.category,
      category_label: article.category_label,
      tags: article.tags || [],
      read_time: article.read_time || "",
      date: article.date || "",
      author: article.author || "",
      image: article.image,
    });
    setTagInput((article.tags || []).join(", "));
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyArticle);
    setTagInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = {
        ...form,
        tags: tagInput.split(",").map((t) => t.trim()).filter(Boolean),
      };
      if (editingId) {
        await updateArticle(editingId, data);
      } else {
        if (!data.slug) data.slug = data.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
        await createArticle(data);
      }
      await fetchArticles();
      closeForm();
    } catch (err) {
      console.error(err);
      alert("فشل حفظ المقال");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return;
    try {
      await deleteArticle(id);
      await fetchArticles();
    } catch (err) {
      console.error(err);
      alert("فشل حذف المقال");
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
            placeholder="بحث في المقالات..."
            className="w-full pr-9 pl-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          مقال جديد
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
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">التاريخ</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((article) => (
                  <tr key={article.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      {article.image ? (
                        <img src={article.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-xs text-muted-foreground">لا توجد</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{article.title}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">{article.description}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{article.category_label}</td>
                    <td className="px-4 py-3 text-muted-foreground">{article.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(article)}
                          className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
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
                {editingId ? "تعديل المقال" : "مقال جديد"}
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
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">التصنيف</label>
                  <select
                    value={form.category}
                    onChange={(e) => {
                      const cat = categoryOptions.find(c => c.value === e.target.value);
                      setForm({ ...form, category: e.target.value, category_label: cat?.label || "" });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {categoryOptions.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">التاريخ</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">مدة القراءة</label>
                  <input
                    value={form.read_time}
                    onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">الكاتب</label>
                  <input
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">الوسوم (مفصولة بفاصلة)</label>
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
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
                folder="blog"
                label="صورة المقال"
              />

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة المقال"}
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
