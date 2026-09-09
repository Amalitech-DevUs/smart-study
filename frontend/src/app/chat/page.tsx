import { RequireAuth } from "@/components/shared/require-auth";
import { ChatEngine } from "@/components/chat/chat-engine";

export default function ChatPage() {
  return (
    <RequireAuth>
      <main className="flex flex-1 flex-col bg-white px-4 py-8 pb-28 sm:px-6 sm:py-10">
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
          <header className="mb-6 border-b border-slate-200 pb-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Study Assistant
            </p>
            <h1 className="mt-1 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
              BECE Tutor
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Ask questions about Mathematics, Integrated Science, English, or Social Studies.
            </p>
          </header>

          <div className="flex flex-1 flex-col rounded-xl border border-slate-200 bg-white p-4 min-h-[550px]">
            <ChatEngine />
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}
