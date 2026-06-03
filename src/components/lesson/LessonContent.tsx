"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface LessonContentProps {
  content: string;
}

export function LessonContent({ content }: LessonContentProps) {
  return (
    <div className="lesson-content">
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
            <ul className="list-disc pr-5 space-y-2 mb-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pr-5 space-y-2 mb-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-[0.95rem] text-muted-foreground leading-relaxed">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
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
              <table className="w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-secondary">
              {children}
            </thead>
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
            <tr className="even:bg-secondary/40">
              {children}
            </tr>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
