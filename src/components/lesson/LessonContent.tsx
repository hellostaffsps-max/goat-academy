"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  TipBox,
  WarningBox,
  CafeTipBox,
  RecipeBox,
  MistakeBox,
  DidYouKnowBox,
  SuccessBox,
} from "./InfoBoxes";
import { cn } from "@/lib/utils";

interface LessonContentProps {
  content: string;
}

type SectionType =
  | "normal"
  | "recipe"
  | "mistake"
  | "tip"
  | "warning"
  | "cafe-tip"
  | "did-you-know"
  | "success";

interface Section {
  title: string | null;
  type: SectionType;
  content: string;
}

function getSectionType(title: string): SectionType {
  const t = title.toLowerCase();
  if (t.includes("وصفة") || t.includes("الوصفة المرجعية")) return "recipe";
  if (t.includes("خطأ") || t.includes("أخطاء") || t.includes("خطأ شائع"))
    return "mistake";
  if (t.includes("تحذير") || t.includes("انتباه")) return "warning";
  if (t.includes("هل تعلم") || t.includes("معلومة")) return "did-you-know";
  if (t.includes("نصيحة للمقاهي") || t.includes("لصاحب المقهى"))
    return "cafe-tip";
  if (t.includes("نصيحة") || t.includes("نصيحة للباريستا") || t.includes("نصيحة عملية"))
    return "tip";
  if (t.includes("حل") || t.includes("الحل")) return "success";
  return "normal";
}

function parseSections(content: string): Section[] {
  const lines = content.split("\n");
  const sections: Section[] = [];
  let currentTitle: string | null = null;
  let currentType: SectionType = "normal";
  let currentLines: string[] = [];

  function flush() {
    if (currentLines.length > 0) {
      sections.push({
        title: currentTitle,
        type: currentType,
        content: currentLines.join("\n").trim(),
      });
    }
  }

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      flush();
      currentTitle = h2Match[1].trim();
      currentType = getSectionType(currentTitle);
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }
  flush();

  return sections;
}

function MarkdownRender({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => (
          <h2 className="text-base font-bold text-foreground mt-6 mb-3">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-semibold text-foreground mt-4 mb-2">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="text-[0.95rem] leading-relaxed text-muted-foreground mb-3">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pr-5 space-y-2 mb-4">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pr-5 space-y-2 mb-4">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-[0.95rem] text-muted-foreground leading-relaxed">
            {children}
          </li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        code: ({ children }) => (
          <code className="rounded bg-secondary px-1 py-0.5 text-xs text-secondary-foreground">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-secondary p-3 rounded-lg mb-4 overflow-x-auto">
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-secondary">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="border border-border px-2 py-2 text-right text-muted-foreground font-semibold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-border px-2 py-2 text-muted-foreground">
            {children}
          </td>
        ),
        tr: ({ children }) => (
          <tr className="even:bg-secondary/40">{children}</tr>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function SectionRenderer({ section }: { section: Section }) {
  const { type, title, content } = section;

  const inner = (
    <>
      {title && type === "normal" && (
        <h2 className="text-base font-bold text-foreground mt-6 mb-3">{title}</h2>
      )}
      <MarkdownRender content={content} />
    </>
  );

  switch (type) {
    case "recipe":
      return <RecipeBox>{inner}</RecipeBox>;
    case "mistake":
      return <MistakeBox>{inner}</MistakeBox>;
    case "tip":
      return <TipBox>{inner}</TipBox>;
    case "warning":
      return <WarningBox>{inner}</WarningBox>;
    case "cafe-tip":
      return <CafeTipBox>{inner}</CafeTipBox>;
    case "did-you-know":
      return <DidYouKnowBox>{inner}</DidYouKnowBox>;
    case "success":
      return <SuccessBox>{inner}</SuccessBox>;
    default:
      return inner;
  }
}

export function LessonContent({ content }: LessonContentProps) {
  const sections = parseSections(content);

  return (
    <div className="lesson-content">
      {sections.map((section, idx) => (
        <SectionRenderer key={idx} section={section} />
      ))}
    </div>
  );
}
