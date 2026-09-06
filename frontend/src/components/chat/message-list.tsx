import type { ChatMessage } from "./use-chat-engine";

type MessageListProps = {
  messages: ChatMessage[];
};

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 font-body">
      {messages.length === 0 ? (
        <p className="m-auto text-center text-sm text-text-secondary">
          Ask a question to start studying.
        </p>
      ) : (
        messages.map((message) => {
          const isStudent = message.role === "student";

          return (
            <div
              key={message.id}
              className={`flex ${isStudent ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${isStudent ? "bg-brand-indigo text-white" : "border border-text-secondary/15 bg-white text-text-primary"}`}
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
