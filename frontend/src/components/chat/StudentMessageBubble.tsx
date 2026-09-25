import React from "react";
import { Copy, Check, Share2, Pencil } from "lucide-react";
import type { ChatMessage } from "./use-chat-engine";

type Props = {
  message: ChatMessage;
  isCopied: boolean;
  isShared: boolean;
  onCopy: (id: string, text: string) => void;
  onShare: (id: string, text: string) => void;
  onEditQuestion?: (text: string) => void;
};

export function StudentMessageBubble({
  message,
  isCopied,
  isShared,
  onCopy,
  onShare,
  onEditQuestion,
}: Props) {
  return (
    <div className="flex flex-col items-end gap-1.5">
      {/* Student Question Bubble */}
      <div className="max-w-[85%] sm:max-w-[75%] rounded-xl rounded-tr-xs bg-[#0e1726] px-4 py-2.5 text-xs sm:text-sm text-white shadow-xs leading-relaxed">
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>

      {/* Student Question Action Buttons: Copy, Share, Edit */}
      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] pr-1">
        <button
          type="button"
          onClick={() => onCopy(message.id, message.content)}
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
          onClick={() => onShare(message.id, message.content)}
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
