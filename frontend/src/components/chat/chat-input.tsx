"use client";

import { FormEvent, KeyboardEvent, useRef } from "react";
import { SendHorizonal } from "lucide-react";

type ChatInputProps = {
  value: string;
  isSending: boolean;
  onChange?: (value: string) => void;
  onSend?: (text?: string) => void;
  onChangeAction?: (value: string) => void;
  onSendAction?: (text?: string) => void;
};

export function ChatInput({
  value,
  isSending,
  onChange,
  onSend,
  onChangeAction,
  onSendAction,
}: ChatInputProps) {
  const handleTextChange = onChange ?? onChangeAction;
  const handleSend = onSend ?? onSendAction;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!value.trim() || isSending) return;
    handleSend?.(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="shrink-0 border-t border-slate-200/80 bg-white px-4 py-3 sm:px-6 md:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-2 py-2.5 transition-all focus-within:border-slate-400 focus-within:bg-white focus-within:shadow-xs"
        >
          <input
            ref={inputRef}
            type="text"
            value={value}
            disabled={isSending}
            onChange={(event) => handleTextChange?.(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a BECE question or concept..."
            aria-label="Chat message"
            className="min-h-[28px] w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none leading-normal disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!value.trim() || isSending}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0e1726] text-white transition-all hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 shadow-sm"
            aria-label="Send message"
          >
            {isSending ? (
              <span className="flex gap-0.5">
                <span className="h-1 w-1 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-1 w-1 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-1 w-1 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            ) : (
              <SendHorizonal className="h-4 w-4 text-amber-400" />
            )}
          </button>
        </form>
        <p className="mt-2 text-center text-[10px] text-slate-400">
          Press <kbd className="rounded border border-slate-200 bg-slate-100 px-1 py-0.5 font-mono text-[10px]">Enter</kbd> to send
        </p>
      </div>
    </div>
  );
}
