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
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-slate-200/80 bg-white px-3 py-2.5 sm:px-4 sm:py-3">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center rounded-full border border-slate-300 bg-slate-50/70 pl-4 pr-1.5 py-1 shadow-xs transition-all focus-within:border-slate-800 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900/5"
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          disabled={isSending}
          onChange={(event) => handleTextChange?.(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a BECE past question or concept..."
          aria-label="Chat message"
          className="w-full bg-transparent py-1 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none leading-normal disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!value.trim() || isSending}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0e1726] text-white transition-all hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
          aria-label="Send message"
        >
          {isSending ? (
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          ) : (
            <SendHorizonal className="h-3.5 w-3.5 text-amber-400" />
          )}
        </button>
      </form>
    </div>
  );
}
