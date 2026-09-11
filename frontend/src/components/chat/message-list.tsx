"use client";

import React, { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "./use-chat-engine";
import {
  ExternalLink,
  Copy,
  Check,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Pencil,
} from "lucide-react";
import { AppLogoBadge } from "@/components/shared/app-logo";

type MessageListProps = {
  messages: ChatMessage[];
  onSelectPrompt?: (prompt: string) => void;
  onEditQuestion?: (text: string) => void;
};

const quickSubjects = [
  {
    subject: "Mathematics",
    prompt: "Solve: 2x + 5 = 15 step-by-step",
  },
  {
    subject: "Science",
    prompt: "Why do plants need chlorophyll for photosynthesis?",
  },
  {
    subject: "English",
    prompt: "What is the difference between active and passive voice?",
  },
  {
    subject: "Social Studies",
    prompt: "List the 3 arms of government in Ghana and their duties",
  },
];

/**
 * Parses inline formatting: links, bold, italics, code
 */
function renderInlineFormatting(text: string): React.ReactNode[] {
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
          </a>
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
        </a>
      );
    } else if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={`bold-${match.index}`} className="font-bold text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (
      (token.startsWith("*") && token.endsWith("*")) ||
      (token.startsWith("_") && token.endsWith("_"))
    ) {
      parts.push(
        <em key={`italic-${match.index}`} className="italic text-slate-700">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={`code-${match.index}`}
          className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono font-medium text-slate-800 border border-slate-200"
        >
          {token.slice(1, -1)}
        </code>
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
function FormattedMessageContent({ content }: { content: string }) {
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

export function MessageList({
  messages,
  onSelectPrompt,
  onEditQuestion,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sharedId, setSharedId] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, "up" | "down">>({});

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleShare = async (id: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "BECE SmartStudy",
          text: text,
        });
        return;
      } catch {
        // Fallback to copy if user cancels or share fails
      }
    }
    await handleCopy(id, text);
    setSharedId(id);
    setTimeout(() => setSharedId(null), 2000);
  };

  const handleRate = (id: string, type: "up" | "down") => {
    setRatings((prev) => {
      if (prev[id] === type) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: type };
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-5">
      {messages.length === 0 ? (
        <div className="my-auto flex flex-col items-center justify-center text-center w-full max-w-md mx-auto py-4 sm:py-6 px-1">
          <AppLogoBadge size="lg" />

          <div className="mt-2.5 inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-3 py-0.5 text-[10px] sm:text-[11px] font-semibold text-slate-700">
            <span>AI Study Companion</span>
          </div>

          <h3 className="mt-2 font-heading text-base sm:text-xl font-bold text-slate-900 leading-tight">
            SmartStudy Revision Tutor
          </h3>
          <p className="mt-1 text-[11px] sm:text-xs text-slate-500 leading-relaxed max-w-[260px] sm:max-w-xs">
            Ask any BECE question or pick a topic below.
          </p>

          <div className="mt-4 sm:mt-6 w-full space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-left px-1">
              Sample questions
            </p>
            <div className="grid gap-2 text-left">
              {quickSubjects.map((item) => (
                <button
                  key={item.prompt}
                  type="button"
                  onClick={() => onSelectPrompt?.(item.prompt)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 sm:p-3 text-[11px] sm:text-xs text-slate-800 transition-all hover:border-slate-400 hover:bg-slate-50 hover:shadow-xs flex items-center justify-between gap-2 group w-full"
                >
                  <span className="font-medium group-hover:text-slate-950 text-left line-clamp-2 sm:truncate leading-snug">
                    {item.prompt}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 whitespace-nowrap">
                    {item.subject}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => {
            const isStudent = message.role === "student";

            if (isStudent) {
              const isCopied = copiedId === message.id;
              const isShared = sharedId === message.id;

              return (
                <div key={message.id} className="flex flex-col items-end gap-1.5">
                  {/* Student Question Bubble */}
                  <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-xs bg-[#0e1726] px-4 py-2.5 text-xs sm:text-sm text-white shadow-xs leading-relaxed">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {/* Student Question Action Buttons: Copy, Share, Edit */}
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] pr-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(message.id, message.content)}
                      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                      title="Copy question"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-600 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <span>&bull;</span>

                    <button
                      type="button"
                      onClick={() => handleShare(message.id, message.content)}
                      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                      title="Share question"
                    >
                      {isShared ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-600 font-medium">Shared</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="h-3 w-3" />
                          <span>Share</span>
                        </>
                      )}
                    </button>

                    {onEditQuestion && (
                      <>
                        <span>&bull;</span>
                        <button
                          type="button"
                          onClick={() => onEditQuestion(message.content)}
                          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          title="Edit question"
                        >
                          <Pencil className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            }

            // AI Tutor Answer Card
            const isCopied = copiedId === message.id;
            const isShared = sharedId === message.id;
            const currentRating = ratings[message.id];

            return (
              <div key={message.id} className="w-full">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs transition-shadow">
                  {/* Answer Content */}
                  <div className="text-xs sm:text-sm leading-relaxed text-slate-800">
                    <FormattedMessageContent content={message.content} />
                  </div>

                  {/* Tutor Answer Action Buttons below the answer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    {/* Left Actions: Copy & Share */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopy(message.id, message.content)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                        title="Copy answer"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-medium text-[11px]">
                              Copied
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleShare(message.id, message.content)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                        title="Share answer"
                      >
                        {isShared ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-medium text-[11px]">
                              Shared
                            </span>
                          </>
                        ) : (
                          <>
                            <Share2 className="h-3.5 w-3.5" />
                            <span className="text-[11px]">Share</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Right Actions: Rate (Thumbs Up / Down) */}
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">
                        Helpful?
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRate(message.id, "up")}
                        className={`p-1.5 rounded-lg transition-colors ${
                          currentRating === "up"
                            ? "bg-emerald-50 text-emerald-600"
                            : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        }`}
                        title="Good answer"
                        aria-label="Thumbs up"
                      >
                        <ThumbsUp
                          className={`h-3.5 w-3.5 ${
                            currentRating === "up" ? "fill-current" : ""
                          }`}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRate(message.id, "down")}
                        className={`p-1.5 rounded-lg transition-colors ${
                          currentRating === "down"
                            ? "bg-rose-50 text-rose-600"
                            : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        }`}
                        title="Not helpful"
                        aria-label="Thumbs down"
                      >
                        <ThumbsDown
                          className={`h-3.5 w-3.5 ${
                            currentRating === "down" ? "fill-current" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
