"use client";

import { useState, useCallback } from "react";

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

async function readResponse(
  response: Response,
  onChunk?: (streamedText: string) => void,
): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!response.body || !contentType.includes("text/event-stream")) {
    const data = await response.json().catch(() => null);
    if (typeof data === "string") return data;
    return (
      data?.reply ??
      data?.data?.reply ??
      data?.content ??
      data?.message ??
      data?.response ??
      ""
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let content = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const data = line.replace(/^data:\s*/, "").trim();
      if (!data || data === "[DONE]") continue;

      try {
        const parsed = JSON.parse(data);
        const text =
          parsed.reply ??
          parsed.content ??
          parsed.delta ??
          parsed.message ??
          "";
        if (text) {
          content += text;
          onChunk?.(content);
        }
      } catch {
        content += data;
        onChunk?.(content);
      }
    }
  }

  return content;
}

export function useChatEngine(): ChatEngineState {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get("prompt") || searchParams.get("q") || "";
    }
    return "";
  });
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
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

        const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content }),
        });

        if (!response.ok) throw new Error("Chat request failed.");

        const assistantId = `assistant-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        let messageAdded = false;

        const assistantContent = await readResponse(response, (liveText) => {
          if (!messageAdded) {
            messageAdded = true;
            setMessages((current) => [
              ...current,
              {
                id: assistantId,
                role: "assistant",
                content: liveText,
                timestamp: new Date().toISOString(),
              },
            ]);
          } else {
            setMessages((current) =>
              current.map((msg) =>
                msg.id === assistantId ? { ...msg, content: liveText } : msg,
              ),
            );
          }
        });

        if (!messageAdded) {
          if (!assistantContent) throw new Error("Chat response was empty.");
          setMessages((currentMessages) => [
            ...currentMessages,
            createMessage("assistant", assistantContent),
          ]);
        }
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
