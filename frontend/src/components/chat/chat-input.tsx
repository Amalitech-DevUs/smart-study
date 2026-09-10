"use client";

import { FormEvent } from "react";
import { Send } from "lucide-react";

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim() || isSending) return;
    handleSend?.(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-[#e2e8f0] bg-white p-3"
    >
      <input
        type="text"
        value={value}
        disabled={isSending}
        onChange={(event) => handleTextChange?.(event.target.value)}
        placeholder="Ask a BECE subject question (e.g. Simplify 3x + 5 = 20)..."
        aria-label="Chat message"
        className="w-full min-h-[44px] rounded-lg border border-[#e2e8f0] bg-[#fbfbfa] py-2.5 px-3.5 text-sm text-[#0e1726] placeholder-[#525b68] outline-none transition-colors focus:border-[#0e1726] focus:bg-white disabled:bg-slate-100"
      />
      {isSending ? (
        <span
          className="flex h-11 w-12 shrink-0 items-center justify-center gap-1 rounded-lg bg-[#0e1726] text-white"
          aria-label="Sending message"
        >
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#f5a623] [animation-delay:-0.2s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#f5a623] [animation-delay:-0.1s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#f5a623]" />
        </span>
      ) : (
        <button
          type="submit"
          disabled={!value.trim()}
          className="flex h-11 w-12 shrink-0 items-center justify-center rounded-lg bg-[#f5a623] text-[#0e1726] transition-colors hover:bg-[#e0951a] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
