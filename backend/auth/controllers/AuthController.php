<?php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/RefreshToken.php';
require_once __DIR__ . '/../utils/JwtHandler.php';

class AuthController
{
    private User $user;
    private RefreshToken $refreshToken;
    private JwtHandler $jwt;

    public function __construct(mysqli $db)
    {
        $this->user = new User($db);
        $this->refreshToken = new RefreshToken($db);
        $this->jwt = new JwtHandler();
    }

    public function signup(string $username, string $pin): array
    {
        $existingUser = $this->user->findByUsername($username);

        if ($existingUser) {
            return [
                'success' => false,
                'message' => 'Username already exists.'
            ];
        }

        $userId = $this->user->create($username, $pin);

        return [
            'success' => true,
            'message' => 'Account created successfully.',
            'user' => [
                'id' => $userId,
                'username' => $username
            ]
        ];
    }

    public function login(string $username, string $pin): array
    {
        $valid = $this->user->verifyPin($username, $pin);

        if (!$valid) {
            return [
                'success' => false,
                'message' => 'Invalid username or PIN.'
            ];
        }

        $user = $this->user->findByUsername($username);

                // Generate JWT
                $accessToken = $this->jwt->generateToken(
            (int) $user['id'],
            $user['username']
        );

        $refreshToken = $this->jwt->generateRefreshToken();

        $refreshTokenHash = $this->jwt->hashRefreshToken(
            $refreshToken
        );

        $expiresAt = date(
            'Y-m-d H:i:s',
            time() + (60 * 60 * 24 * 30)
        );

        $this->refreshToken->create(
            (int) $user['id'],
            $refreshTokenHash,
            $expiresAt
        );

        return [
            'success' => true,
            'message' => 'Login successful.',
            'user' => [
                'id' => (int) $user['id'],
                'username' => $user['username']
            ],
            'accessToken' => $accessToken,
            'refreshToken' => $refreshToken
        ];
    }

    public function refresh(string $refreshToken): array
{
    if ($refreshToken === '') {
        return [
            'success' => false,
            'message' => 'Refresh token is required.'
        ];
    }

    $tokenHash = $this->jwt->hashRefreshToken($refreshToken);

    $storedToken = $this->refreshToken->findByTokenHash($tokenHash);

    if (!$storedToken) {
        return [
            'success' => false,
            'message' => 'Invalid refresh token.'
        ];
    }

    if (strtotime($storedToken['expires_at']) < time()) {
        return [
            'success' => false,
            'message' => 'Refresh token has expired.'
        ];
    }

    $user = $this->user->findById(
        (int) $storedToken['user_id']
    );

    if (!$user) {
        return [
            'success' => false,
            'message' => 'User not found.'
        ];
    }

    $accessToken = $this->jwt->generateToken(
        (int) $user['id'],
        $user['username']
    );

    return [
        'success' => true,
        'message' => 'Access token refreshed successfully.',
        'accessToken' => $accessToken
    ];
}
}