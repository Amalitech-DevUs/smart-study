<?php

require_once __DIR__ . '/../models/Attempt.php';
require_once __DIR__ . '/../models/StudySessionResult.php';

class ProgressController
{
    private Attempt $attempt;
    private StudySessionResult $sessionResult;

    public function __construct(PDO $db)
    {
        $this->attempt = new Attempt($db);
        $this->sessionResult = new StudySessionResult($db);
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

    public function recordSessionResult(int $userId, array $input): array
    {
        $integerFields = [
            'year',
            'paper',
            'uniqueQuestionsTotal',
            'uniqueQuestionsCompleted',
            'totalAttempts',
            'correctCount',
            'incorrectCount',
            'unansweredCount',
            'scorePercent'
        ];

        foreach (['sessionId', 'sessionKey', 'subject', 'subjectSlug', 'mode', 'startedAt', 'completedAt'] as $field) {
            if (!isset($input[$field]) || !is_string($input[$field]) || trim($input[$field]) === '') {
                return ['success' => false, 'message' => 'Invalid session result.'];
            }
        }

        $values = [];
        foreach ($integerFields as $field) {
            $value = filter_var($input[$field] ?? null, FILTER_VALIDATE_INT);
            if ($value === false) {
                return ['success' => false, 'message' => 'Invalid session result.'];
            }
            $values[$field] = $value;
        }

        if (
            ($input['isCompleted'] ?? false) !== true ||
            !in_array($input['mode'], ['practice', 'test'], true) ||
            $values['year'] < 1 ||
            $values['paper'] < 1 ||
            $values['uniqueQuestionsTotal'] < 1 ||
            $values['uniqueQuestionsCompleted'] < 0 ||
            $values['uniqueQuestionsCompleted'] > $values['uniqueQuestionsTotal'] ||
            $values['totalAttempts'] < 0 ||
            $values['correctCount'] < 0 ||
            $values['incorrectCount'] < 0 ||
            $values['unansweredCount'] < 0 ||
            $values['scorePercent'] < 0 ||
            $values['scorePercent'] > 100
        ) {
            return ['success' => false, 'message' => 'Invalid session result.'];
        }

        try {
            $startedAt = (new DateTimeImmutable($input['startedAt']))->format(DateTimeInterface::ATOM);
            $completedAt = (new DateTimeImmutable($input['completedAt']))->format(DateTimeInterface::ATOM);
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Invalid session result date.'];
        }

        $timeSpentSeconds = $input['timeSpentSeconds'] ?? null;
        if ($timeSpentSeconds !== null) {
            $timeSpentSeconds = filter_var($timeSpentSeconds, FILTER_VALIDATE_INT);
            if ($timeSpentSeconds === false || $timeSpentSeconds < 0) {
                return ['success' => false, 'message' => 'Invalid session result.'];
            }
        }

        $record = [
            'sessionId' => trim($input['sessionId']),
            'sessionKey' => trim($input['sessionKey']),
            'subject' => trim($input['subject']),
            'subjectSlug' => trim($input['subjectSlug']),
            'year' => $values['year'],
            'paper' => $values['paper'],
            'mode' => $input['mode'],
            'startedAt' => $startedAt,
            'completedAt' => $completedAt,
            'uniqueQuestionsTotal' => $values['uniqueQuestionsTotal'],
            'uniqueQuestionsCompleted' => $values['uniqueQuestionsCompleted'],
            'totalAttempts' => $values['totalAttempts'],
            'correctCount' => $values['correctCount'],
            'incorrectCount' => $values['incorrectCount'],
            'unansweredCount' => $values['unansweredCount'],
            'scorePercent' => $values['scorePercent'],
            'timeSpentSeconds' => $timeSpentSeconds
        ];

        $this->sessionResult->saveForUser($userId, $record);

        return ['success' => true, 'message' => 'Session result recorded successfully.'];
    }

    public function getSessionResults(int $userId): array
    {
        return [
            'success' => true,
            'results' => $this->sessionResult->getByUserId($userId)
        ];
    }
}