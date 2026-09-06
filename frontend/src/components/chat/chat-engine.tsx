"use client";

import { ChatFallback } from "./chat-fallback";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";
import { useChatEngine } from "./use-chat-engine";

export function ChatEngine() {
  const { messages, input, isSending, error, setInput, sendMessage } =
    useChatEngine();

  return (
    <section className="flex min-h-[24rem] w-full min-w-0 flex-col overflow-hidden rounded-lg border border-text-secondary/15 bg-background shadow-sm">
      <MessageList messages={messages} />
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
