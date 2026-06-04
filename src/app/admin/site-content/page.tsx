"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllSiteContent, updateSiteContent, type ContentSection } from "@/actions/site-content";
import { Save, RotateCcw, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionConfig = {
  key: ContentSection;
  label: string;
  description: string;
};

const sections: SectionConfig[] = [
  { key: "hero_section", label: "القسم الرئيسي (Hero)", description: "الشعار، العنوان، الوصف، الأزرار، المميزات" },
  { key: "founder_section", label: "قسم المؤسس", description: "الصورة، النص، الإنجازات، الزر" },
  { key: "paths_section", label: "قسم المسارات", description: "البطاقات الثلاث (الباريستا، تأسيس، تطوير)" },
  { key: "success_stories", label: "قصص النجاح", description: "الشهادات والإحصائيات" },
  { key: "tools_section", label: "معاينة الأدوات", description: "الأدوات الأربع المعروضة في الرئيسية" },
  { key: "resources_section", label: "المصادر المجانية", description: "التحميلات ونموذج الاشتراك" },
];

export default function SiteContentPage() {
  const [contents, setContents] = useState<Record<ContentSection, string>>({
    hero_section: "",
    founder_section: "",
    paths_section: "",
    success_stories: "",
    tools_section: "",
    resources_section: "",
  });
  const [activeTab, setActiveTab] = useState<ContentSection>("hero_section");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchContents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllSiteContent();
      const parsed = {} as Record<ContentSection, string>;
      for (const section of sections) {
        parsed[section.key] = data[section.key] ? JSON.stringify(data[section.key], null, 2) : "";
      }
      setContents(parsed);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "فشل تحميل البيانات من الخادم" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const json = JSON.parse(contents[activeTab]);
      await updateSiteContent(activeTab, json);
      setMessage({ type: "success", text: "تم الحفظ بنجاح! سيتم تحديث الموقع." });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: "error", text: "خطأ في صيغة JSON، يرجى التحقق من البيانات." });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("هل أنت متأكد من استعادة البيانات من الخادم؟ سيتم فقدان التغييرات غير المحفوظة.")) return;
    await fetchContents();
    setMessage({ type: "success", text: "تمت الاستعادة بنجاح." });
    setTimeout(() => setMessage(null), 3000);
  };

  const activeConfig = sections.find((s) => s.key === activeTab)!;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">إدارة محتوى الموقع</h1>
          <p className="text-xs text-muted-foreground">تعديل أقسام الصفحة الرئيسية والمحتوى الثابت</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-border hover:bg-secondary transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            استعادة
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-accent text-accent-foreground hover:opacity-90 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            حفظ
          </button>
        </div>
      </div>

      {message && (
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs",
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          )}
        >
          {message.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar tabs */}
        <div className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveTab(section.key)}
              className={cn(
                "w-full text-right px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                activeTab === section.key
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <div>{section.label}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 font-normal">{section.description}</div>
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-foreground">{activeConfig.label}</h2>
              <p className="text-[10px] text-muted-foreground">{activeConfig.description}</p>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-md bg-secondary text-muted-foreground font-mono">
              {activeTab}
            </span>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="text-center py-12 text-sm text-muted-foreground">جاري التحميل...</div>
            ) : (
              <textarea
                value={contents[activeTab]}
                onChange={(e) => setContents((prev) => ({ ...prev, [activeTab]: e.target.value }))}
                className="w-full h-[500px] bg-secondary/30 border border-border rounded-lg px-3 py-2 text-xs text-foreground font-mono leading-relaxed focus:outline-none focus:border-accent transition-colors resize-none"
                dir="ltr"
                spellCheck={false}
              />
            )}
          </div>
          <div className="px-4 py-3 border-t border-border bg-secondary/20 text-[10px] text-muted-foreground">
            استخدم صيغة JSON صالحة. يمكنك إضافة أو حذف أو تعديل أي حقل. إذا حذفت قسماً بالكامل، سيستخدم الموقع القيم الافتراضية.
          </div>
        </div>
      </div>
    </div>
  );
}
