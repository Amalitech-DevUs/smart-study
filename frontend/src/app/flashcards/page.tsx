import { FlashcardsList } from "@/components/flashcards/FlashcardsList";

type PageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function FlashcardsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialQuery = resolvedSearchParams?.q || "";

  return <FlashcardsList key={initialQuery} initialQuery={initialQuery} />;
}
