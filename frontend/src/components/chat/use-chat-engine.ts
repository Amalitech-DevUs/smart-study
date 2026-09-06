"use client";

import { useCallback, useState } from "react";

export type ChatMessage = {
  id: string;
  role: "student" | "assistant";
  content: string;
  timestamp: string;
};

type ChatEngineState = {
  messages: ChatMessage[];
  input: string;
  isSending: boolean;
  error: string | null;
  setInput: (value: string) => void;
  sendMessage: (text?: string) => Promise<void>;
};

function createMessage(
  role: ChatMessage["role"],
  content: string,
): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    timestamp: new Date().toISOString(),
  };
}

async function readResponse(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!response.body || !contentType.includes("text/event-stream")) {
    const data = await response.json().catch(() => null);
    if (typeof data === "string") return data;
    return data?.content ?? data?.message ?? data?.response ?? "";
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let content = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split("\n")) {
      const data = line.startsWith("data:")
        ? line.slice(5).trim()
        : line.trim();
      if (!data || data === "[DONE]") continue;

      try {
        const parsed = JSON.parse(data);
        content += parsed.content ?? parsed.delta ?? parsed.message ?? "";
      } catch {
        content += data;
      }
    }
  }

  return content;
}

export function useChatEngine(): ChatEngineState {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || isSending) return;

      const studentMessage = createMessage("student", content);
      setMessages((currentMessages) => [...currentMessages, studentMessage]);
      setInput("");
      setError(null);
      setIsSending(true);

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!baseUrl) throw new Error("Chat service is not configured.");

        const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content }),
        });

        if (!response.ok) throw new Error("Chat request failed.");

        const assistantContent = await readResponse(response);
        if (!assistantContent) throw new Error("Chat response was empty.");

        setMessages((currentMessages) => [
          ...currentMessages,
          createMessage("assistant", assistantContent),
        ]);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "The study assistant is unavailable.",
        );
      } finally {
        setIsSending(false);
      }
    },
    [input, isSending],
  );

  return { messages, input, isSending, error, setInput, sendMessage };
}
