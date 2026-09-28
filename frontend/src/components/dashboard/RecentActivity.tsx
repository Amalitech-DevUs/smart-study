import Link from "next/link";
import type { StudySessionRecord } from "@/lib/learning-tracker";

type Props = {
  recentActivity: StudySessionRecord[];
};

export function RecentActivity({ recentActivity }: Props) {
  return (
    <section aria-labelledby="activity-heading">
      <div className="flex items-center justify-between mb-3">
        <h2 id="activity-heading" className="font-heading text-lg font-bold text-slate-900">
          Recent Activity
        </h2>
        <Link
          href="/flashcards"
          className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          View all papers &rarr;
        </Link>
      </div>

      {recentActivity.length > 0 ? (
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {recentActivity.map((session) => {
            const dateStr = new Date(session.completedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            });

            return (
              <div
                key={session.sessionId}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 gap-2 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900">
                      {session.subject} ({session.year} BECE)
                    </p>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                      {session.mode === "practice" ? "Practice" : "Test"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {session.uniqueQuestionsCompleted} questions &bull; {dateStr}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-bold ${
                      session.scorePercent >= 70
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {session.scorePercent}%
                  </span>

                  <Link
                    href={`/flashcards/${session.subjectSlug}/${session.year}`}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Review &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
          <p className="text-xs text-slate-500">
            No study sessions completed yet. Choose a subject above to start practicing.
          </p>
        </div>
      )}
    </section>
  );
}
