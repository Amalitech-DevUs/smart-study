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
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-white">
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
