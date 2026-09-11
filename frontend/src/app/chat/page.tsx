import { ChatEngine } from "@/components/chat/chat-engine";

export default function ChatPage() {
  return (
    <main className="flex flex-1 flex-col bg-slate-50/50 px-4 py-8 pb-28 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
        <header className="mb-6 border-b border-slate-200 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <span>AI Study Companion</span>
              </div>
              <h1 className="mt-1 font-heading text-2xl font-extrabold text-slate-900 sm:text-3xl">
                BECE Study Tutor
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Available 24/7 to break down exam problems, clarify concepts, and guide your revision.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">Tutor Online</span>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col rounded-2xl bg-white shadow-xs min-h-[600px] border border-slate-200 overflow-hidden">
          <ChatEngine />
        </div>
      </div>
    </main>
  );
}
