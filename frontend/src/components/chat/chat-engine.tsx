"use client";

import { ChatFallback } from "./chat-fallback";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";
import { useChatEngine } from "./use-chat-engine";

export function ChatEngine() {
  const { messages, input, isSending, error, setInput, sendMessage } =
    useChatEngine();

  const handleSelectPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <section className="flex min-h-[30rem] w-full min-w-0 flex-1 flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/85 shadow-2xl backdrop-blur-xl">
      <MessageList messages={messages} onSelectPrompt={handleSelectPrompt} />
      {error ? <ChatFallback /> : null}
      <ChatInput
        value={input}
        isSending={isSending}
        onChange={setInput}
        onSend={sendMessage}
      />
    </section>
  );
}
