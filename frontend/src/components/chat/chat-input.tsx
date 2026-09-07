"use client";

import { FormEvent } from "react";
import { Send } from "lucide-react";

type ChatInputProps = {
  value: string;
  isSending: boolean;
  onChange: (value: string) => void;
  onSend: (text: string) => void;
};

export function ChatInput({
  value,
  isSending,
  onChange,
  onSend,
}: ChatInputProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim() || isSending) return;
    onSend(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-slate-200/80 bg-white/90 p-3 backdrop-blur-md font-body"
    >
      <input
        type="text"
        value={value}
        disabled={isSending}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Type your study question here..."
        aria-label="Chat message"
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-brand-gold focus:bg-white focus:ring-4 focus:ring-brand-gold/20 disabled:bg-slate-100"
      />
      {isSending ? (
        <span
          className="flex h-11 w-12 shrink-0 items-center justify-center gap-1 rounded-2xl bg-brand-indigo text-white"
          aria-label="Sending message"
        >
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-gold [animation-delay:-0.2s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-gold [animation-delay:-0.1s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-gold" />
        </span>
      ) : (
        <button
          type="submit"
          disabled={!value.trim()}
          className="flex h-11 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-brand-gold to-[#f3b250] text-brand-indigo shadow-sm transition-all hover:shadow-md hover:shadow-brand-gold/25 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
