<?php

class User
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    // Find a user by username
    public function findByUsername(string $username): ?array
    {
        $sql = "SELECT id, username, pin_hash, created_at
                FROM users
                WHERE username = ?
                LIMIT 1";

        $stmt = $this->db->prepare($sql);

        if (!$stmt) {
            throw new Exception("Failed to prepare query: " . $this->db->error);
        }

        $stmt->bind_param("s", $username);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            return null;
        }

        return $result->fetch_assoc();
    }

    // Create a new user
    public function create(string $username, string $pin): int
    {
        $pinHash = password_hash($pin, PASSWORD_BCRYPT);

        $sql = "INSERT INTO users (username, pin_hash)
                VALUES (?, ?)";

        $stmt = $this->db->prepare($sql);

        if (!$stmt) {
            throw new Exception("Failed to prepare insert query: " . $this->db->error);
        }

        $stmt->bind_param("ss", $username, $pinHash);

        if (!$stmt->execute()) {
            throw new Exception("Failed to create user: " . $stmt->error);
        }

        return $stmt->insert_id;
    }

    // Verify user's PIN
    public function verifyPin(string $username, string $pin): bool
    {
        $user = $this->findByUsername($username);

        if (!$user) {
            return false;
        }

        return password_verify($pin, $user['pin_hash']);
    }
}