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
    <div className="flex h-full w-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200">
      <MessageList
        messages={messages}
        onSelectPrompt={handleSelectPrompt}
        onEditQuestion={(text) => setInput(text)}
      />
      {error ? <ChatFallback /> : null}
      <ChatInput
        value={input}
        isSending={isSending}
        onChange={setInput}
        onSend={sendMessage}
      />
    </div>
  );
}
