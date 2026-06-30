"use client";

import { use, useEffect } from "react";
import { downloadResources } from "@/data/downloadResources";
import { notFound, useRouter } from "next/navigation";
import { Printer, ArrowRight, BookOpen } from "lucide-react";

export default function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug } = use(params);
  const resource = downloadResources[slug];

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("print=true")) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!resource) {
    notFound();
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background pb-12 animate-fade-in text-right" dir="rtl">
      {/* Print-only Header (repeats on every page) */}
      <div className="hidden print:block fixed top-0 left-0 right-0 border-b border-border/40 pb-2 mb-6 text-xs text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>{resource.title}</span>
          <span>أكاديمية تفاعلية للقهوة</span>
        </div>
      </div>

      {/* Print-only Footer (repeats on every page) */}
      <div className="hidden print:flex fixed bottom-0 left-0 right-0 border-t border-border/40 pt-2 mt-6 text-[10px] text-muted-foreground justify-between items-center print-footer">
        <span>Powered by Wael</span>
        <span>GoatJourney Academy</span>
      </div>

      {/* Web navbar and action bar */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-4 flex items-center justify-between border-b border-border/40 print:hidden mb-8">
        <button
          onClick={() => router.push("/downloads")}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          الرجوع للمصادر
        </button>

        <button
          onClick={handlePrint}
          className="btn-premium flex items-center gap-2 text-xs font-semibold px-4 py-2"
        >
          <Printer className="w-4 h-4" />
          تحميل وطباعة كـ PDF
        </button>
      </div>

      {/* Main Document Container */}
      <article className="max-w-3xl mx-auto px-6 py-8 bg-card border border-border/60 rounded-3xl print:border-none print:bg-transparent print:p-0 print:m-0 shadow-sm relative overflow-hidden">
        {/* Decorative corner element for web, hidden in print */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full pointer-events-none print:hidden" />

        {/* Cover Title Area */}
        <header className="border-b border-border/80 pb-6 mb-8 text-center sm:text-right">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-[10px] font-semibold px-3 py-1 rounded-full border border-accent/20 mb-4 print:hidden">
            <BookOpen className="w-3 h-3" />
            وثيقة جاهزة للتحميل والطباعة
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3 tracking-tight">
            {resource.title}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
            {resource.description}
          </p>
          <div className="flex justify-center sm:justify-start items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span>الصيغة: A4 PDF</span>
            <span className="w-1.5 h-1.5 rounded-full bg-border" />
            <span>حجم التقديري: {resource.pages}</span>
          </div>
        </header>

        {/* Sections Content */}
        <div className="space-y-8 leading-relaxed text-sm text-foreground/90">
          {resource.sections.map((section, idx) => (
            <section key={idx} className="print:break-inside-avoid mb-6">
              <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2 border-r-4 border-accent pr-3 py-0.5">
                {section.title}
              </h2>
              <div className="whitespace-pre-line text-muted-foreground leading-relaxed text-xs sm:text-sm">
                {section.content}
              </div>
            </section>
          ))}

          {/* Optional Table Data (e.g. Equipment Price List) */}
          {resource.tableData && (
            <div className="print:break-inside-avoid mt-8 overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-secondary/60 text-foreground border-b border-border">
                    {resource.tableData.headers.map((header, idx) => (
                      <th key={idx} className="p-3 font-bold border-l border-border/40 last:border-l-0">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resource.tableData.rows.map((row, rowIdx) => (
                    <tr
                      key={rowIdx}
                      className="border-b border-border/40 hover:bg-secondary/20 transition-colors last:border-none"
                    >
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="p-3 border-l border-border/40 last:border-l-0 text-muted-foreground">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Web Footer Disclaimer, hidden in print */}
        <footer className="mt-12 pt-6 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground print:hidden">
          <span>أكاديمية تفاعلية لمقاهي فلسطين</span>
          <span className="font-mono">Powered by Wael</span>
        </footer>
      </article>

      {/* Global CSS to optimize print layout */}
      <style jsx global>{`
        @media print {
          /* Hide everything except article */
          body * {
            visibility: hidden;
          }
          article, article * {
            visibility: visible;
          }
          /* Absolute positioning to print only the article */
          article {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /* Header and footer visibility on print */
          .print-footer, .print-footer * {
            visibility: visible;
          }
          /* Custom margin setup */
          @page {
            size: A4;
            margin: 20mm 15mm 20mm 15mm;
          }
        }
      `}</style>
    </div>
  );
}
