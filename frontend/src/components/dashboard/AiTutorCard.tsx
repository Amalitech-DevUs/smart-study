import Link from "next/link";
import { Bot, ArrowRight } from "lucide-react";
import type { FocusAreaTopic } from "@/lib/learning-tracker";

type Props = {
  focusAreas: FocusAreaTopic[];
};

export function AiTutorCard({ focusAreas }: Props) {
  const topFocus = focusAreas[0];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-2">
        <Bot className="h-4 w-4 text-slate-700" />
        <h3 className="font-heading text-sm font-bold text-slate-900">
          SmartStudy AI Tutor
        </h3>
      </div>

      {topFocus ? (
        <div>
          <p className="text-xs text-slate-600 leading-relaxed">
            You are having difficulty with{" "}
            <span className="font-semibold text-slate-900">{topFocus.topic}</span> in{" "}
            {topFocus.subject}.
          </p>
          <Link
            href={`/chat?q=${encodeURIComponent(
              `Can you explain the key concepts, formulas, and common exam questions for ${topFocus.topic} in BECE ${topFocus.subject}?`,
            )}`}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            <span>Explain this topic</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Need help understanding a past question, formula, or exam concept?
          </p>
          <Link
            href="/chat"
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            <span>Ask AI Tutor</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
