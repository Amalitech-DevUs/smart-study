<?php

require_once __DIR__ . '/../models/Attempt.php';

class ProgressController
{
    private Attempt $attempt;

    public function __construct(PDO $db)
    {
        $this->attempt = new Attempt($db);
    }

    public function recordAttempts(int $userId, array $attempts): array
    {
        $saved = [];

        foreach ($attempts as $item) {

            $questionId = (int) ($item['questionId'] ?? 0);
            $result = $item['result'] ?? '';
            $attemptsTaken = (int) ($item['attemptsTaken'] ?? 1);

            if ($questionId <= 0) {
                continue;
            }

            if (!in_array($result, ['correct', 'incorrect'], true)) {
                continue;
            }

            if ($attemptsTaken < 1) {
                $attemptsTaken = 1;
            }

            $id = $this->attempt->create(
                $userId,
                $questionId,
                $result,
                $attemptsTaken
            );

            $saved[] = [
                'id' => $id,
                'questionId' => $questionId,
                'result' => $result,
                'attemptsTaken' => $attemptsTaken
            ];
        }

        return [
            'success' => true,
            'message' => 'Attempts recorded successfully.',
            'attempts' => $saved
        ];
    }
}