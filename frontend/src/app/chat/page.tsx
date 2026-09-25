import Link from "next/link";
import { ChatEngine } from "@/components/chat/chat-engine";
import { RequireAuth } from "@/components/shared/require-auth";
import { ArrowLeft, Bot } from "lucide-react";

export default function ChatPage() {
  return (
    <RequireAuth>
      <div className="flex h-[calc(100svh-56px)] flex-col bg-white md:h-screen">
        {/* Slim top bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200/90 bg-white px-4 py-3 sm:px-6 md:px-8">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Dashboard</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0e1726]">
                <Bot className="h-3.5 w-3.5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-none">BECE Study Tutor</p>
                <p className="text-[10px] text-slate-400 leading-none mt-0.5">Powered by SmartStudy AI</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </div>
          </div>
        </div>

        {/* Chat engine fills remaining height */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ChatEngine />
        </div>
      </div>
    </RequireAuth>
  );
}
