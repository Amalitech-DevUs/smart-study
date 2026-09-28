import React from "react";
import { ExternalLink } from "lucide-react";

/**
 * Parses inline formatting: links, bold, italics, code
 */
export function renderInlineFormatting(text: string): React.ReactNode[] {
  const tokenRegex =
    /(\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)|https?:\/\/[^\s]+|\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|`[^`]+`)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith("[") && token.includes("](")) {
      const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
      if (linkMatch) {
        const linkText = linkMatch[1];
        const href = linkMatch[2];
        parts.push(
          <a
            key={`link-${match.index}`}
            href={href}
            target={href.startsWith("http") ? "_blank" : "_self"}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-600 underline-offset-2 transition-colors break-all"
          >
            <span>{linkText}</span>
            <ExternalLink className="h-3 w-3 inline shrink-0" />
          </a>,
        );
      }
    } else if (token.startsWith("http://") || token.startsWith("https://")) {
      parts.push(
        <a
          key={`url-${match.index}`}
          href={token}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-600 underline-offset-2 transition-colors break-all"
        >
          <span>{token}</span>
          <ExternalLink className="h-3 w-3 inline shrink-0" />
        </a>,
      );
    } else if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={`bold-${match.index}`} className="font-bold text-slate-900">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (
      (token.startsWith("*") && token.endsWith("*")) ||
      (token.startsWith("_") && token.endsWith("_"))
    ) {
      parts.push(
        <em key={`italic-${match.index}`} className="italic text-slate-700">
          {token.slice(1, -1)}
        </em>,
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={`code-${match.index}`}
          className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono font-medium text-slate-800 border border-slate-200"
        >
          {token.slice(1, -1)}
        </code>,
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

/**
 * Comprehensive markdown renderer: transforms headers (###), horizontal lines (---),
 * bullet lists (- ), numbered lists (1. ), and paragraphs into clean native elements.
 */
export function FormattedMessageContent({ content }: { content: string }) {
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
          return <hr key={idx} className="my-2.5 border-t border-slate-200" />;
        }

        // Heading 1
        if (line.startsWith("# ")) {
          return (
            <h1
              key={idx}
              className="font-heading text-base sm:text-lg font-extrabold text-slate-900 mt-3 mb-1"
            >
              {renderInlineFormatting(line.slice(2))}
            </h1>
          );
        }

        // Heading 2
        if (line.startsWith("## ")) {
          return (
            <h2
              key={idx}
              className="font-heading text-sm sm:text-base font-bold text-slate-900 mt-2.5 mb-1"
            >
              {renderInlineFormatting(line.slice(3))}
            </h2>
          );
        }

        // Heading 3
        if (line.startsWith("### ")) {
          return (
            <h3
              key={idx}
              className="font-heading text-xs sm:text-sm font-bold text-slate-900 mt-2.5 mb-1 text-[#0e1726]"
            >
              {renderInlineFormatting(line.slice(4))}
            </h3>
          );
        }

        // Bullet lists
        if (/^[-*]\s+/.test(line)) {
          const itemText = line.replace(/^[-*]\s+/, "");
          return (
            <div key={idx} className="flex items-start gap-2 pl-1.5 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div className="flex-1 leading-relaxed text-slate-700">
                {renderInlineFormatting(itemText)}
              </div>
            </div>
          );
        }

        // Numbered lists
        const numMatch = line.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
              <span className="font-bold text-slate-700 shrink-0 text-xs mt-0.5">
                {numMatch[1]}.
              </span>
              <div className="flex-1 leading-relaxed text-slate-800">
                {renderInlineFormatting(numMatch[2])}
              </div>
            </div>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="leading-relaxed">
            {renderInlineFormatting(line)}
          </p>
        );
      })}
    </div>
  );
}
