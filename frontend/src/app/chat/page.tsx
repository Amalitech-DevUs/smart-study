import { RequireAuth } from "@/components/shared/require-auth";
import { ChatEngine } from "@/components/chat/chat-engine";

export default function ChatPage() {
  return (
    <RequireAuth>
      <main className="flex flex-1 flex-col bg-background px-4 py-8 pb-24 sm:px-6 sm:py-12">
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">
          <header className="mb-6">
            <p className="text-sm font-medium uppercase tracking-wide text-brand-gold">
              Study assistant
            </p>
            <h1 className="mt-2 font-heading text-4xl font-bold text-brand-indigo">
              Ask a question
            </h1>
          </header>
          <div className="flex flex-1">
            <ChatEngine />
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}
