import { RequireAuth } from "@/components/shared/require-auth";

export default function ChatPage() {
  return (
    <RequireAuth>
      <main className="flex flex-1 items-center justify-center bg-background px-6 py-16">
        <h1 className="font-heading text-3xl font-bold text-brand-indigo">
          Chat — coming soon
        </h1>
      </main>
    </RequireAuth>
  );
}
