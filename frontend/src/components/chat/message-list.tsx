import type { ChatMessage } from "./use-chat-engine";
import { Bot, User, Sparkles } from "lucide-react";

type MessageListProps = {
  messages: ChatMessage[];
  onSelectPrompt?: (prompt: string) => void;
};

const samplePrompts = [
  "Explain the Pythagorean theorem with an example",
  "How does photosynthesis work in plants?",
  "What is the difference between active and passive voice?",
  "Summarize key causes of the Industrial Revolution",
];

export function MessageList({ messages, onSelectPrompt }: MessageListProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 font-body sm:p-6">
      {messages.length === 0 ? (
        <div className="my-auto flex flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold/15 text-brand-gold shadow-md">
            <Bot className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-heading text-2xl font-bold text-slate-900">
            How can I help you study today?
          </h3>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Ask any question about Mathematics, Science, English, or Social Studies past papers.
          </p>

          <div className="mt-8 flex w-full max-w-lg flex-col gap-2.5">
            <p className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-gold">
              <Sparkles className="h-3.5 w-3.5" />
              Try asking:
            </p>
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onSelectPrompt?.(prompt)}
                className="rounded-2xl border border-slate-200/80 bg-white/80 p-3 text-left text-xs font-medium text-slate-700 shadow-sm transition-all hover:border-brand-gold hover:bg-white hover:shadow-md"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        messages.map((message) => {
          const isStudent = message.role === "student";

          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                isStudent ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold shadow-sm ${
                  isStudent
                    ? "bg-brand-gold text-brand-indigo"
                    : "bg-brand-indigo text-white"
                }`}
              >
                {isStudent ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-3xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
                  isStudent
                    ? "rounded-tr-none bg-brand-indigo text-white"
                    : "rounded-tl-none border border-slate-200/80 bg-white text-slate-800"
                }`}
              >
                {message.content}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
