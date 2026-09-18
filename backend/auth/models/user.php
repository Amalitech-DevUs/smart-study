<?php

class User
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    // Find a user by username
    public function findByUsername(string $username): ?array
    {
        $sql = "SELECT id, username, pin_hash, created_at
                FROM users
                WHERE username = :username
                LIMIT 1";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':username' => $username
        ]);

        $user = $stmt->fetch();

        return $user ?: null;
    }

    // Create a new user
    public function create(string $username, string $pin): int
    {
        $pinHash = password_hash($pin, PASSWORD_BCRYPT);

        $sql = "INSERT INTO users (username, pin_hash)
                VALUES (:username, :pin_hash)";

        $stmt = $this->db->prepare($sql);

        $stmt->execute([
            ':username' => $username,
            ':pin_hash' => $pinHash
        ]);

        return (int) $this->db->lastInsertId();
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

    // Find a user by ID
    public function findById(int $id): ?array
    {
        $sql = "SELECT id, username, pin_hash, created_at
                FROM users
                WHERE id = :id
                LIMIT 1";

        $stmt = $this->db->prepare($sql);

        $stmt->execute([
            ':id' => $id
        ]);

        $user = $stmt->fetch();

        return $user ?: null;
    }
}