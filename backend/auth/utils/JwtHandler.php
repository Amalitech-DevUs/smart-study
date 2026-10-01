<?php

if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
    require_once __DIR__ . '/../vendor/autoload.php';
} else {
    require_once __DIR__ . '/../../../vendor/autoload.php';
}

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;

class JwtHandler
{
    private string $secretKey;

    public function __construct()
    {
        if (file_exists(__DIR__ . '/../../src/.env')) {
            $dotenv = Dotenv::createImmutable(__DIR__ . '/../../src');
            $dotenv->safeLoad();
        } elseif (file_exists(__DIR__ . '/../../../.env')) {
            $dotenv = Dotenv::createImmutable(__DIR__ . '/../../../');
            $dotenv->safeLoad();
        }

        $secretKey = getenv('JWT_SECRET');
        if ($secretKey === false || $secretKey === '') {
            $secretKey = $_ENV['JWT_SECRET'] ?? $_SERVER['JWT_SECRET'] ?? null;
        }

        if (!is_string($secretKey) || strlen($secretKey) < 32) {
            throw new RuntimeException('JWT_SECRET must be configured with at least 32 characters.');
        }

        $this->secretKey = $secretKey;
    }

    public function generateToken(int $userId, string $username): string
    {
        $issuedAt = time();
        $expiresAt = $issuedAt + (60 * 60);

        $payload = [
            'iat' => $issuedAt,
            'exp' => $expiresAt,
            'user_id' => $userId,
            'username' => $username
        ];

        return JWT::encode(
            $payload,
            $this->secretKey,
            'HS256'
        );
    }

    public function validateToken(string $token): object
    {
        return JWT::decode(
            $token,
            new Key($this->secretKey, 'HS256')
        );
    }
}