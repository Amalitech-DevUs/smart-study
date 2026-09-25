import type { LearningOverviewData } from "@/lib/learning-tracker";

type Props = {
  overview: LearningOverviewData;
};

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 font-heading text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-0.5 text-[11px] text-slate-400">{sub}</p>
    </div>
  );
}

export function LearningOverview({ overview }: Props) {
  return (
    <section aria-labelledby="overview-heading">
      <h2 id="overview-heading" className="sr-only">
        Learning Overview
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Questions Practiced"
          value={String(overview.questionsPracticed)}
          sub="Unique questions"
        />
        <StatCard
          label="Practice Accuracy"
          value={overview.questionsPracticed > 0 ? `${overview.practiceAccuracy}%` : "—"}
          sub={overview.questionsPracticed > 0 ? "On practice mode" : "No practice yet"}
        />
        <StatCard
          label="Test Average"
          value={overview.testAverage !== null ? `${overview.testAverage}%` : "—"}
          sub={overview.testAverage !== null ? "Timed exams" : "No tests completed"}
        />
        <StatCard
          label="Study Sessions"
          value={String(overview.studySessions)}
          sub="Total sessions"
        />
      </div>
    </section>
  );
}
