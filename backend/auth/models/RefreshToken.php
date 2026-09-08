<?php

class RefreshToken
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function create(
        int $userId,
        string $tokenHash,
        string $expiresAt
    ): int {
        $sql = "INSERT INTO refresh_tokens
                (user_id, token_hash, expires_at)
                VALUES (?, ?, ?)";

        $stmt = $this->db->prepare($sql);

        if (!$stmt) {
            throw new Exception("Failed to prepare refresh token query.");
        }

        $stmt->bind_param(
            "iss",
            $userId,
            $tokenHash,
            $expiresAt
        );

        if (!$stmt->execute()) {
            throw new Exception("Failed to store refresh token.");
        }

        return $stmt->insert_id;
    }

    public function findByTokenHash(string $tokenHash): ?array
    {
        $sql = "SELECT id, user_id, token_hash, expires_at
                FROM refresh_tokens
                WHERE token_hash = ?
                LIMIT 1";

        $stmt = $this->db->prepare($sql);

        if (!$stmt) {
            throw new Exception("Failed to prepare refresh token query.");
        }

        $stmt->bind_param("s", $tokenHash);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            return null;
        }

        return $result->fetch_assoc();
    }
}