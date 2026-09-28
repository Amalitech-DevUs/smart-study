"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Sparkles,
  X,
  ExternalLink,
  Send,
  RotateCcw,
  Loader2,
} from "lucide-react";

export type InlineAiTutorProps = {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
  topic?: string;
  year?: number;
  question: string;
  options: Array<{ id: string; text: string }>;
  selectedOptionId?: string | null;
  correctOptionId: string;
  explanation?: string;
  mode?: "practice" | "test" | "review";
};

type Message = {
  id: string;
  role: "student" | "assistant";
  content: string;
  timestamp: string;
};

function createTutorMessage(role: Message["role"], content: string): Message {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    role,
    content,
    timestamp: new Date().toISOString(),
  };
}

async function readTutorStream(
  res: Response,
  onChunk: (text: string) => void,
): Promise<string> {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("text/event-stream") || !res.body) {
    const json = await res.json().catch(() => null);
    return (
      json?.data?.reply ||
      json?.reply ||
      json?.content ||
      "Here is the key concept to keep in mind: revise the definition and practice similar problems."
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const data = line.replace(/^data:\s*/, "").trim();
      if (!data || data === "[DONE]") continue;

      try {
        const parsed = JSON.parse(data);
        const text = parsed.reply ?? parsed.content ?? parsed.delta ?? "";
        if (text) {
          accumulated += text;
          onChunk(accumulated);
        }
      } catch {
        accumulated += data;
        onChunk(accumulated);
      }
    }
  }

  return accumulated;
}

export function InlineAiTutor({
  isOpen,
  onClose,
  subject,
  topic,
  year,
  question,
  options,
  selectedOptionId,
  correctOptionId,
  explanation,
}: InlineAiTutorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const selectedOpt = options.find(
    (o) => o.id.toLowerCase() === selectedOptionId?.toLowerCase(),
  );
  const correctOpt = options.find(
    (o) => o.id.toLowerCase() === correctOptionId.toLowerCase(),
  );

  const selectedText = selectedOpt ? selectedOpt.text : "";
  const correctText = correctOpt ? correctOpt.text : "";

  // Build the full chat link
  const fullChatPrompt = selectedOptionId
    ? `I am preparing for the ${subject} BECE${year ? ` (${year})` : ""}. Question: "${question}". I picked Option ${selectedOptionId.toUpperCase()} ("${selectedText}"), but the correct answer is Option ${correctOptionId.toUpperCase()} ("${correctText}"). Please explain my mistake and how to solve it correctly.`
    : `Please explain this ${subject} BECE question: "${question}".`;
  const fullChatUrl = `/chat?prompt=${encodeURIComponent(fullChatPrompt)}`;

  // Quick prompt suggestions
  const suggestions = [
    ...(selectedOptionId && selectedOptionId.toLowerCase() !== correctOptionId.toLowerCase()
      ? [
          {
            label: "Explain my mistake",
            prompt: `Why is Option ${selectedOptionId.toUpperCase()} ("${selectedText}") incorrect, and why is Option ${correctOptionId.toUpperCase()} ("${correctText}") the correct answer?`,
          },
        ]
      : []),
    {
      label: "Step-by-step breakdown",
      prompt: `Can you walk me through the step-by-step reasoning for this ${subject} question: "${question}"?`,
    },
    {
      label: "Give me a memory tip",
      prompt: `What is an easy rule, formula, or trick to remember this concept for the BECE?`,
    },
  ];

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendQuery = async (userPrompt: string) => {
    if (!userPrompt.trim() || isLoading) return;

    const studentMsg = createTutorMessage("student", userPrompt);
    setMessages((prev) => [...prev, studentMsg]);
    setInput("");
    setIsLoading(true);

    // Contextual system-grade prompt for AI
    const contextualPayload = `Context:
- Subject: ${subject}
- Topic: ${topic || "General"}
- Exam: BECE Ghana (${year || "General"})
- Question: "${question}"
- Student's Selected Answer: ${selectedOptionId ? `Option ${selectedOptionId.toUpperCase()} ("${selectedText}")` : "None"}
- Correct Answer: Option ${correctOptionId.toUpperCase()} ("${correctText}")
- Syllabus Explanation: "${explanation || ""}"

Student's Question: ${userPrompt}

Please act as a friendly, encouraging Ghanaian BECE tutor. Use clear, simple language suitable for a Junior High School student. Explain directly, point out the key concept, and give actionable advice for exam day.`;

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

      const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: contextualPayload,
        }),
      });

      if (!res.ok) throw new Error("Could not reach AI service.");

      const assistantId = `assistant-${studentMsg.id}`;
      let hasAdded = false;

      const reply = await readTutorStream(res, (accumulated) => {
        if (!hasAdded) {
          hasAdded = true;
          setMessages((prev) => [
            ...prev,
            {
              id: assistantId,
              role: "assistant",
              content: accumulated,
              timestamp: new Date().toISOString(),
            },
          ]);
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: accumulated } : m,
            ),
          );
        }
      });

      if (!hasAdded && reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: "assistant",
            content: reply,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      // Graceful offline fallback explanation
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: selectedOptionId && selectedOptionId.toLowerCase() !== correctOptionId.toLowerCase()
            ? `You selected Option ${selectedOptionId.toUpperCase()} ("${selectedText}"). The correct answer according to official WAEC guidelines is Option ${correctOptionId.toUpperCase()} ("${correctText}").\n\n${explanation || "Review the formula or rule carefully before trying again."}`
            : `Option ${correctOptionId.toUpperCase()} ("${correctText}") is the correct answer according to official WAEC scoring standards.\n\n${explanation || "Keep up the practice!"}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInput("");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.2 }}
        className="mt-4 overflow-hidden rounded-2xl border border-indigo-200/80 bg-gradient-to-b from-indigo-50/40 via-white to-white shadow-lg shadow-indigo-500/5"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-100 bg-white/80 px-4 py-3 backdrop-blur-sm sm:px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0e1726] shadow-sm shadow-slate-900/20">
              <Bot className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-xs font-bold text-slate-900">
                  SmartStudy AI Tutor
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Personalized explanation for this question
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                title="Clear conversation"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
            <Link
              href={fullChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              title="Open in full screen AI chat"
            >
              <span>Full chat</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              aria-label="Close AI Tutor"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Chat Body */}
        <div className="max-h-80 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-xs">
          {messages.length === 0 ? (
            <div className="py-2 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 mb-2.5">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="font-semibold text-slate-800">
                Stuck on this question?
              </p>
              <p className="mt-1 text-slate-500 text-[11px] max-w-sm mx-auto leading-relaxed">
                SmartStudy AI can explain where you went wrong, walk you through the correct steps, or give you a memory shortcut.
              </p>

              {/* Suggestions */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => sendQuery(s.prompt)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition-all active:scale-[0.98]"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.role === "student" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 leading-relaxed sm:max-w-[85%] ${
                      m.role === "student"
                        ? "rounded-tr-sm bg-[#0e1726] text-white"
                        : "rounded-tl-sm border border-slate-200/90 bg-white text-slate-800 shadow-sm whitespace-pre-wrap"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-slate-400 py-1">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                  <span className="text-[11px]">Thinking through the explanation...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendQuery(input);
          }}
          className="border-t border-slate-100 bg-slate-50/70 p-3 sm:px-4 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about this problem..."
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0e1726] text-white transition-all hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send query"
          >
            <Send className="h-3.5 w-3.5 text-amber-400" />
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
