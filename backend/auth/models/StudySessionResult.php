<?php

class StudySessionResult
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function saveForUser(int $userId, array $record): void
    {
        $sql = "INSERT INTO study_sessions (
                    user_id, session_id, session_key, subject, subject_slug, year, paper, mode,
                    started_at, completed_at, unique_questions_total, unique_questions_completed,
                    total_attempts, correct_count, incorrect_count, unanswered_count, score_percent,
                    time_spent_seconds
                ) VALUES (
                    :user_id, :session_id, :session_key, :subject, :subject_slug, :year, :paper, :mode,
                    :started_at, :completed_at, :unique_questions_total, :unique_questions_completed,
                    :total_attempts, :correct_count, :incorrect_count, :unanswered_count, :score_percent,
                    :time_spent_seconds
                )
                ON CONFLICT (user_id, session_id) DO UPDATE SET
                    session_key = excluded.session_key,
                    subject = excluded.subject,
                    subject_slug = excluded.subject_slug,
                    year = excluded.year,
                    paper = excluded.paper,
                    mode = excluded.mode,
                    started_at = excluded.started_at,
                    completed_at = excluded.completed_at,
                    unique_questions_total = excluded.unique_questions_total,
                    unique_questions_completed = excluded.unique_questions_completed,
                    total_attempts = excluded.total_attempts,
                    correct_count = excluded.correct_count,
                    incorrect_count = excluded.incorrect_count,
                    unanswered_count = excluded.unanswered_count,
                    score_percent = excluded.score_percent,
                    time_spent_seconds = excluded.time_spent_seconds";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':user_id' => $userId,
            ':session_id' => $record['sessionId'],
            ':session_key' => $record['sessionKey'],
            ':subject' => $record['subject'],
            ':subject_slug' => $record['subjectSlug'],
            ':year' => $record['year'],
            ':paper' => $record['paper'],
            ':mode' => $record['mode'],
            ':started_at' => $record['startedAt'],
            ':completed_at' => $record['completedAt'],
            ':unique_questions_total' => $record['uniqueQuestionsTotal'],
            ':unique_questions_completed' => $record['uniqueQuestionsCompleted'],
            ':total_attempts' => $record['totalAttempts'],
            ':correct_count' => $record['correctCount'],
            ':incorrect_count' => $record['incorrectCount'],
            ':unanswered_count' => $record['unansweredCount'],
            ':score_percent' => $record['scorePercent'],
            ':time_spent_seconds' => $record['timeSpentSeconds']
        ]);
    }

    public function getByUserId(int $userId): array
    {
        $sql = "SELECT
                    session_id AS sessionId,
                    session_key AS sessionKey,
                    subject,
                    subject_slug AS subjectSlug,
                    year,
                    paper,
                    mode,
                    started_at AS startedAt,
                    completed_at AS completedAt,
                    unique_questions_total AS uniqueQuestionsTotal,
                    unique_questions_completed AS uniqueQuestionsCompleted,
                    total_attempts AS totalAttempts,
                    correct_count AS correctCount,
                    incorrect_count AS incorrectCount,
                    unanswered_count AS unansweredCount,
                    score_percent AS scorePercent,
                    time_spent_seconds AS timeSpentSeconds
                FROM study_sessions
                WHERE user_id = :user_id
                ORDER BY completed_at DESC, id DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':user_id' => $userId]);

        return array_map(static function (array $row): array {
            return [
                'sessionId' => $row['sessionId'],
                'sessionKey' => $row['sessionKey'],
                'subject' => $row['subject'],
                'subjectSlug' => $row['subjectSlug'],
                'year' => (int) $row['year'],
                'paper' => (int) $row['paper'],
                'mode' => $row['mode'],
                'startedAt' => (new DateTimeImmutable($row['startedAt']))->getTimestamp() * 1000,
                'completedAt' => (new DateTimeImmutable($row['completedAt']))->getTimestamp() * 1000,
                'isCompleted' => true,
                'uniqueQuestionsTotal' => (int) $row['uniqueQuestionsTotal'],
                'uniqueQuestionsCompleted' => (int) $row['uniqueQuestionsCompleted'],
                'totalAttempts' => (int) $row['totalAttempts'],
                'correctCount' => (int) $row['correctCount'],
                'incorrectCount' => (int) $row['incorrectCount'],
                'unansweredCount' => (int) $row['unansweredCount'],
                'scorePercent' => (int) $row['scorePercent'],
                'timeSpentSeconds' => $row['timeSpentSeconds'] === null ? null : (int) $row['timeSpentSeconds']
            ];
        }, $stmt->fetchAll());
    }
}