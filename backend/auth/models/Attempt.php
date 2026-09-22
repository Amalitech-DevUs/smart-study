<?php

class Attempt
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    // Save a flashcard attempt
    public function create(
        int $userId,
        int $questionId,
        string $result,
        int $attemptsTaken = 1
    ): int {
        $sql = "INSERT INTO attempts
                (user_id, question_id, result, attempts_taken)
                VALUES
                (:user_id, :question_id, :result, :attempts_taken)";

        $stmt = $this->db->prepare($sql);

        $stmt->execute([
            ':user_id' => $userId,
            ':question_id' => $questionId,
            ':result' => $result,
            ':attempts_taken' => $attemptsTaken
        ]);

        return (int) $this->db->lastInsertId();
    }

    // Get all attempts for a user
    public function getByUserId(int $userId): array
    {
        $sql = "SELECT
                    id,
                    question_id,
                    result,
                    attempts_taken,
                    timestamp
                FROM attempts
                WHERE user_id = :user_id
                ORDER BY timestamp DESC";

        $stmt = $this->db->prepare($sql);

        $stmt->execute([
            ':user_id' => $userId
        ]);

        return $stmt->fetchAll();
    }
}