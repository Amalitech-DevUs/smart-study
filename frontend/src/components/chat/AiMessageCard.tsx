import React from "react";
import { Copy, Check, Share2, ThumbsUp, ThumbsDown } from "lucide-react";
import type { ChatMessage } from "./use-chat-engine";
import { FormattedMessageContent } from "./FormattedMessageContent";

type Props = {
  message: ChatMessage;
  isCopied: boolean;
  isShared: boolean;
  currentRating?: "up" | "down";
  onCopy: (id: string, text: string) => void;
  onShare: (id: string, text: string) => void;
  onRate: (id: string, type: "up" | "down") => void;
};

export function AiMessageCard({
  message,
  isCopied,
  isShared,
  currentRating,
  onCopy,
  onShare,
  onRate,
}: Props) {
  return (
    <div className="w-full">
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs transition-shadow">
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
              onClick={() => onCopy(message.id, message.content)}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              title="Copy answer"
            >
              {isCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium text-[11px]">Copied</span>
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
              onClick={() => onShare(message.id, message.content)}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              title="Share answer"
            >
              {isShared ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium text-[11px]">Shared</span>
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
            <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Helpful?</span>
            <button
              type="button"
              onClick={() => onRate(message.id, "up")}
              className={`p-1.5 rounded-lg transition-colors ${
                currentRating === "up"
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              }`}
              title="Good answer"
              aria-label="Thumbs up"
            >
              <ThumbsUp
                className={`h-3.5 w-3.5 ${currentRating === "up" ? "fill-current" : ""}`}
              />
            </button>

            <button
              type="button"
              onClick={() => onRate(message.id, "down")}
              className={`p-1.5 rounded-lg transition-colors ${
                currentRating === "down"
                  ? "bg-rose-50 text-rose-600"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              }`}
              title="Not helpful"
              aria-label="Thumbs down"
            >
              <ThumbsDown
                className={`h-3.5 w-3.5 ${currentRating === "down" ? "fill-current" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
