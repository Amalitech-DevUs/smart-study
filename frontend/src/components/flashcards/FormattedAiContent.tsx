import React from "react";
import { FormattedExamText } from "./FormattedExamText";

/**
 * Clean Markdown renderer for AI tutor answers
 */
export function FormattedAiContent({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-800">
      {lines.map((rawLine, idx) => {
        const line = rawLine.trim();

        if (!line) {
          return <div key={idx} className="h-1.5" />;
        }

        // Horizontal dividers
        if (/^[-*_]{3,}$/.test(line)) {
          return <hr key={idx} className="my-2 border-t border-slate-200" />;
        }

        // Heading 1 / 2 / 3
        if (line.startsWith("# ")) {
          return (
            <h1 key={idx} className="font-heading text-sm sm:text-base font-bold text-slate-900 mt-2 mb-0.5">
              <FormattedExamText text={line.slice(2)} />
            </h1>
          );
        }
        if (line.startsWith("## ") || line.startsWith("### ")) {
          const depth = line.startsWith("## ") ? 3 : 4;
          return (
            <h2 key={idx} className="font-heading text-xs sm:text-sm font-bold text-[#0e1726] mt-2 mb-0.5">
              <FormattedExamText text={line.slice(depth)} />
            </h2>
          );
        }

        // Bullet lists
        if (/^[-*]\s+/.test(line)) {
          const itemText = line.replace(/^[-*]\s+/, "");
          return (
            <div key={idx} className="flex items-start gap-2 pl-1.5 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <div className="flex-1 leading-relaxed text-slate-700">
                <FormattedExamText text={itemText} />
              </div>
            </div>
          );
        }

        // Numbered lists
        const numMatch = line.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
              <span className="font-bold text-indigo-700 shrink-0 text-xs mt-0.5">
                {numMatch[1]}.
              </span>
              <div className="flex-1 leading-relaxed text-slate-800">
                <FormattedExamText text={numMatch[2]} />
              </div>
            </div>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="leading-relaxed">
            <FormattedExamText text={line} />
          </p>
        );
      })}
    </div>
  );
}
