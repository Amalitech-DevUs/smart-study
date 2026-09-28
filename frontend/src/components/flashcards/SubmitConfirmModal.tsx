import React from "react";
import { Check } from "lucide-react";

type Props = {
  isOpen: boolean;
  testAnsweredCount: number;
  totalQuestions: number;
  testUnansweredCount: number;
  onClose: () => void;
  onSubmit: () => void;
};

export function SubmitConfirmModal({
  isOpen,
  testAnsweredCount,
  totalQuestions,
  testUnansweredCount,
  onClose,
  onSubmit,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 mb-4">
          <Check className="h-5 w-5" />
        </div>

        <h3 className="font-heading text-lg font-bold text-slate-900">
          Submit Your Examination?
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-600">
          You have answered <strong>{testAnsweredCount}</strong> of{" "}
          <strong>{totalQuestions}</strong> questions.
          {testUnansweredCount > 0 && (
            <span className="text-amber-700 font-medium block mt-1">
              Note: {testUnansweredCount} question(s) remain unanswered and will be marked as incorrect.
            </span>
          )}
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Keep Reviewing
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-xl bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-800 transition-colors"
          >
            Confirm &amp; Submit
          </button>
        </div>
      </div>
    </div>
  );
}
