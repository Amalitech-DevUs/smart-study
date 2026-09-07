<?php

require_once __DIR__ . '/../../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../../');
$dotenv->load();

class JwtHandler
{
    private string $secretKey;

    public function __construct()
    {
        $this->secretKey = $_ENV['JWT_SECRET'] ?? '';

        if ($this->secretKey === '') {
            throw new Exception('JWT_SECRET is not configured.');
        }
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