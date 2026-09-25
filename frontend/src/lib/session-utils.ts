// Pure utility functions for the MCQ session system.
// Extracted from session-runner.tsx and mcq-card.tsx to keep components lean and reusable.

export type QuestionOption = { id: string; text: string };

export type SessionQuestion = {
  id: string | number;
  options: QuestionOption[];
  correctOptionId: string;
  topic?: string;
  year?: number;
  paper?: number;
  subject?: string;
};

/** Format seconds into MM:SS display string. */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

/**
 * Returns true if it is safe to shuffle the answer options without
 * breaking references like "all of the above", "both A and B", etc.
 */
export function isSafeToShuffle(options: QuestionOption[]): boolean {
  const unsafePattern =
    /\b(all of the above|none of the above|both [a-d]|neither [a-d]|both of the above|neither of the above|options? [a-d]|above|below)\b/i;
  return !options.some((o) => unsafePattern.test(o.text));
}

/** Shuffle answer options safely, updating the correctOptionId accordingly. */
export function shuffleOptionsSafely<T extends SessionQuestion>(q: T): T {
  if (!isSafeToShuffle(q.options)) return q;

  const correctOption = q.options.find(
    (o) => o.id.toLowerCase() === q.correctOptionId.toLowerCase(),
  );
  if (!correctOption) return q;

  const shuffledTexts = [...q.options.map((o) => o.text)].sort(
    () => Math.random() - 0.5,
  );
  const letters = ["a", "b", "c", "d"];

  const newOptions = letters.map((letter, idx) => ({
    id: letter,
    text: shuffledTexts[idx] || `Option ${letter.toUpperCase()}`,
  }));

  const newCorrectIndex = shuffledTexts.indexOf(correctOption.text);
  const newCorrectId =
    newCorrectIndex >= 0 ? letters[newCorrectIndex] : q.correctOptionId;

  return { ...q, options: newOptions, correctOptionId: newCorrectId };
}

export type ParsedQuestion = {
  hasPassage: boolean;
  passageType?: "reading" | "cloze" | "context";
  contextIntro?: string;
  passageBody?: string;
  questionText: string;
};

/**
 * Intelligent prompt parser that separates reading passages and cloze stories
 * from the actual target question being answered.
 */
export function parseQuestionPrompt(raw: string): ParsedQuestion {
  if (!raw) return { hasPassage: false, questionText: "" };
  const trimmed = raw.trim();

  // Pattern 1: Question separator (e.g. "Question: ...", "Question : ...")
  const qSepMatch = trimmed.match(/^([\s\S]*?)(?:\s*(?:Question|QUESTION)\s*:\s*)([\s\S]*)$/);
  if (qSepMatch) {
    const rawPassage = qSepMatch[1].trim();
    const questionText = qSepMatch[2].trim();

    let contextIntro: string | undefined = undefined;
    let passageBody = rawPassage;

    // Check if the passage opens with an intro scene/premise
    const introMatch = rawPassage.match(
      /^([^.!?\n]+(?:\s+(?:sur|avec|à|le|pour|au|dans)\s+[^.!?\n]+)?\.)\s+([A-ZÀ-ÖØ-Ý«][\s\S]*)$/
    );
    if (introMatch && introMatch[1].length < 130 && introMatch[2].length > 30) {
      contextIntro = introMatch[1].trim();
      passageBody = introMatch[2].trim();
    }

    return {
      hasPassage: true,
      passageType: "reading",
      contextIntro,
      passageBody,
      questionText: questionText.length > 0 ? questionText : raw,
    };
  }

  // Pattern 2: Cloze Test with trailing question (e.g. "Which word fills gap (31)?")
  const clozeMatch = trimmed.match(
    /^([\s\S]*?)\s*((?:Which word fills gap|In the passage below, choose the best word for gap|Which word best completes the gap)\s*\(?\d+\)?\??)$/i
  );
  if (clozeMatch) {
    const rawPassage = clozeMatch[1].trim();
    const questionText = clozeMatch[2].trim();

    let contextIntro: string | undefined = undefined;
    let passageBody = rawPassage;
    const titleMatch = rawPassage.match(/^([^.!?\n]{3,60}\.)\s+([\s\S]+)$/);
    if (titleMatch) {
      contextIntro = titleMatch[1].trim();
      passageBody = titleMatch[2].trim();
    }

    return {
      hasPassage: true,
      passageType: "cloze",
      contextIntro,
      passageBody,
      questionText,
    };
  }

  // Pattern 3: Explicit double newline separating context from question
  if (trimmed.includes("\n\n")) {
    const segments = trimmed.split(/\n\n+/);
    if (segments.length >= 2) {
      const questionText = segments.pop()!.trim();
      const passageBody = segments.join("\n\n").trim();
      return {
        hasPassage: true,
        passageType: "context",
        passageBody,
        questionText,
      };
    }
  }

  return {
    hasPassage: false,
    questionText: trimmed,
  };
}

/**
 * Format dialogue speaker turns (e.g. "Pierre :", "Rebecca :") onto clean separate lines.
 */
export function formatDialogue(text: string): string {
  if (!text) return "";
  return text.replace(
    /\s+((?:[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+|M\.\s*[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+|Mme\s*[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+)\s*:)/g,
    "\n$1"
  );
}
