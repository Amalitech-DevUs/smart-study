import type { ChatMessage } from "./use-chat-engine";
import { Bot, User, Sparkles } from "lucide-react";

type MessageListProps = {
  messages: ChatMessage[];
  onSelectPrompt?: (prompt: string) => void;
};

const samplePrompts = [
  "Simplify the algebraic expression: 3(2x + 5) - 4x",
  "Explain the process of photosynthesis for BECE Science",
  "What are the main functions of the Executive branch of government in Ghana?",
  "What is the difference between active and passive voice in English?",
];

export function MessageList({ messages, onSelectPrompt }: MessageListProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 font-body sm:p-6">
      {messages.length === 0 ? (
        <div className="my-auto flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#fff8eb] border border-[#f5a623]/30 text-[#b87609]">
            <Bot className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-heading text-2xl font-extrabold text-[#0e1726]">
            How can your BECE Tutor help today?
          </h3>
          <p className="mt-1.5 max-w-md text-xs text-[#525b68]">
            Ask any question about Mathematics, Integrated Science, English Language, or Social Studies.
          </p>

          <div className="mt-6 flex w-full max-w-lg flex-col gap-2">
            <p className="flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-wider text-[#c0392b]">
              <Sparkles className="h-3.5 w-3.5" />
              Try asking:
            </p>
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onSelectPrompt?.(prompt)}
                className="paper-card margin-accent-gold p-3 text-left text-xs font-medium text-[#0e1726] transition-colors hover:border-[#0e1726]"
              >
                &quot;{prompt}&quot;
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
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  isStudent
                    ? "bg-[#f5a623] text-[#0e1726]"
                    : "bg-[#0e1726] text-white"
                }`}
              >
                {isStudent ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-lg px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap ${
                  isStudent
                    ? "bg-[#0e1726] text-white"
                    : "paper-card border border-[#e2e8f0] bg-white text-[#0e1726]"
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
