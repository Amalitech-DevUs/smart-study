import type { DailyGoalData } from "@/lib/learning-tracker";

const TARGETS = [10, 20, 30, 50] as const;

type Props = {
  dailyGoal: DailyGoalData;
  onTargetChange: (target: number) => void;
};

export function DailyGoalCard({ dailyGoal, onTargetChange }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-heading text-sm font-bold text-slate-900">Today&apos;s Goal</h3>
        <span className="text-xs font-bold text-slate-700 tabular-nums">
          {dailyGoal.completed} / {dailyGoal.target} questions
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full bg-amber-500 transition-all duration-300"
          style={{ width: `${dailyGoal.percent}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-slate-500">
        {dailyGoal.remaining === 0
          ? "Daily goal reached! Great job."
          : `${dailyGoal.remaining} questions remaining today (${dailyGoal.percent}% completed).`}
      </p>

      {/* Target selector buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <p className="text-[11px] font-medium text-slate-400 mb-1.5">
          Target questions per day:
        </p>
        <div className="grid grid-cols-4 gap-1.5">
          {TARGETS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onTargetChange(t)}
              className={`rounded py-1 text-xs font-semibold transition-colors ${
                dailyGoal.target === t
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
