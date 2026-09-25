import React from "react";
import { ExternalLink } from "lucide-react";

/**
 * Advanced text formatter for MCQ prompts, passages, options, and explanations.
 * - Handles blanks (_____) with distinct visual fill-in pill styling
 * - Handles cloze gap markers (e.g. (31)) with active/inactive highlights
 * - Handles bold (**), italics (*), code (`), links, and French guillemets (« »)
 */
export function FormattedExamText({
  text,
  activeGap,
  className = "",
}: {
  text: string;
  activeGap?: number;
  className?: string;
}) {
  if (!text) return null;

  const lines = text.split("\n");

  return (
    <span className={className}>
      {lines.map((line, lineIdx) => {
        const tokenRegex =
          /(_{2,}|(?:\(([0-9]{1,2})\))|\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)|https?:\/\/[^\s]+|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|«[^»]+»)/g;

        const elements: React.ReactNode[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = tokenRegex.exec(line)) !== null) {
          if (match.index > lastIndex) {
            elements.push(line.substring(lastIndex, match.index));
          }

          const token = match[0];

          if (/^_{2,}$/.test(token)) {
            // Fill-in-the-blank slot
            elements.push(
              <span
                key={`blank-${lineIdx}-${match.index}`}
                className="inline-flex items-center justify-center min-w-[3.5rem] px-2.5 py-0.5 mx-1 font-mono font-bold text-amber-900 bg-amber-100/80 border-b-2 border-amber-500 rounded-sm shadow-xs select-none align-baseline text-xs sm:text-sm"
                title="Fill in the blank"
              >
                ______
              </span>,
            );
          } else if (match[2]) {
            // Gap marker like (31)
            const gapNum = parseInt(match[2], 10);
            const isActive = activeGap !== undefined && gapNum === activeGap;
            elements.push(
              <span
                key={`gap-${lineIdx}-${match.index}`}
                className={`inline-flex items-center justify-center px-2 py-0.5 mx-1 rounded-md text-xs font-bold transition-all ${
                  isActive
                    ? "bg-amber-400 text-slate-950 ring-2 ring-amber-500 shadow-sm scale-105"
                    : "bg-slate-200/90 text-slate-700 font-mono"
                }`}
              >
                ({gapNum})
              </span>,
            );
          } else if (token.startsWith("«") && token.endsWith("»")) {
            elements.push(
              <span
                key={`quote-${lineIdx}-${match.index}`}
                className="font-serif italic text-slate-900"
              >
                «&nbsp;{token.slice(1, -1).trim()}&nbsp;»
              </span>,
            );
          } else if (token.startsWith("[") && token.includes("](")) {
            const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
            if (linkMatch) {
              elements.push(
                <a
                  key={`link-${lineIdx}-${match.index}`}
                  href={linkMatch[2]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors"
                >
                  <span>{linkMatch[1]}</span>
                  <ExternalLink className="h-3 w-3 inline shrink-0" />
                </a>,
              );
            }
          } else if (token.startsWith("http://") || token.startsWith("https://")) {
            elements.push(
              <a
                key={`url-${lineIdx}-${match.index}`}
                href={token}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors"
              >
                <span>{token}</span>
                <ExternalLink className="h-3 w-3 inline shrink-0" />
              </a>,
            );
          } else if (token.startsWith("**") && token.endsWith("**")) {
            elements.push(
              <strong key={`bold-${lineIdx}-${match.index}`} className="font-bold text-slate-900">
                {token.slice(2, -2)}
              </strong>,
            );
          } else if (token.startsWith("*") && token.endsWith("*")) {
            elements.push(
              <em key={`italic-${lineIdx}-${match.index}`} className="italic text-slate-700">
                {token.slice(1, -1)}
              </em>,
            );
          } else if (token.startsWith("`") && token.endsWith("`")) {
            elements.push(
              <code
                key={`code-${lineIdx}-${match.index}`}
                className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono font-medium text-slate-800 border border-slate-200"
              >
                {token.slice(1, -1)}
              </code>,
            );
          }

          lastIndex = tokenRegex.lastIndex;
        }

        if (lastIndex < line.length) {
          elements.push(line.substring(lastIndex));
        }

        const isSpeakerLine =
          /^(?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+|M\.\s*[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+|Mme\s*[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+)\s*:/.test(
            line,
          );

        return (
          <React.Fragment key={`line-${lineIdx}`}>
            {lineIdx > 0 && <br />}
            <span className={isSpeakerLine ? "block py-0.5" : undefined}>
              {elements.length > 0 ? elements : line}
            </span>
          </React.Fragment>
        );
      })}
    </span>
  );
}
