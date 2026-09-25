"use client";

import React, { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "./use-chat-engine";
import { EmptyChatState } from "./EmptyChatState";
import { StudentMessageBubble } from "./StudentMessageBubble";
import { AiMessageCard } from "./AiMessageCard";

type MessageListProps = {
  messages: ChatMessage[];
  onSelectPrompt?: (prompt: string) => void;
  onEditQuestion?: (text: string) => void;
};

export function MessageList({
  messages,
  onSelectPrompt,
  onEditQuestion,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sharedId, setSharedId] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, "up" | "down">>({});

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleShare = async (id: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "BECE SmartStudy",
          text: text,
        });
        return;
      } catch {
        // Fallback to copy if user cancels or share fails
      }
    }
    await handleCopy(id, text);
    setSharedId(id);
    setTimeout(() => setSharedId(null), 2000);
  };

  const handleRate = (id: string, type: "up" | "down") => {
    setRatings((prev) => {
      if (prev[id] === type) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: type };
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-6 md:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
        {messages.length === 0 ? (
          <EmptyChatState onSelectPrompt={onSelectPrompt} />
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isStudent = message.role === "student";

              if (isStudent) {
                return (
                  <StudentMessageBubble
                    key={message.id}
                    message={message}
                    isCopied={copiedId === message.id}
                    isShared={sharedId === message.id}
                    onCopy={handleCopy}
                    onShare={handleShare}
                    onEditQuestion={onEditQuestion}
                  />
                );
              }

              return (
                <AiMessageCard
                  key={message.id}
                  message={message}
                  isCopied={copiedId === message.id}
                  isShared={sharedId === message.id}
                  currentRating={ratings[message.id]}
                  onCopy={handleCopy}
                  onShare={handleShare}
                  onRate={handleRate}
                />
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
}
