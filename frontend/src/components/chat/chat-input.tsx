"use client";

import { FormEvent } from "react";

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
    onSend(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 border-t border-text-secondary/15 bg-white p-3 font-body"
    >
      <input
        type="text"
        value={value}
        disabled={isSending}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ask a study question..."
        aria-label="Chat message"
        className="min-h-11 min-w-0 flex-1 rounded-md border border-text-secondary/30 px-3 text-sm text-text-primary outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 disabled:bg-gray-100"
      />
      {isSending ? (
        <span
          className="flex min-h-11 min-w-20 items-center justify-center gap-1 rounded-md bg-brand-indigo px-4"
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
          className="min-h-11 rounded-md bg-brand-gold px-4 font-medium text-brand-indigo transition-colors hover:bg-brand-gold/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      )}
    </form>
  );
}
