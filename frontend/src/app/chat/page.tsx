import { RequireAuth } from "@/components/shared/require-auth";
import { ChatEngine } from "@/components/chat/chat-engine";
import { GraduationCap } from "lucide-react";

export default function ChatPage() {
  return (
    <RequireAuth>
      <main className="flex flex-1 flex-col bg-[#fbfbfa] px-4 py-8 pb-24 sm:px-6 sm:py-10">
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">
          <header className="mb-6 border-b border-[#e2e8f0] pb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c0392b]">
              <GraduationCap className="h-4 w-4" />
              <span>BECE AI Study Tutor</span>
            </div>
            <h1 className="mt-1 font-heading text-3xl font-extrabold text-[#0e1726]">
              Ask Your BECE Tutor
            </h1>
            <p className="mt-1 text-xs text-[#525b68]">
              Ask questions about BECE Mathematics, Integrated Science, English, or Social Studies for step-by-step guidance.
            </p>
          </header>
          <div className="flex flex-1 paper-card margin-accent-gold overflow-hidden bg-white p-4">
            <ChatEngine />
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}
