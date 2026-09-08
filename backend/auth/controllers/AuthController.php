<?php

require_once __DIR__ . '/../models/user.php';
require_once __DIR__ . '/../utils/JwtHandler.php';

class AuthController
{
    private User $user;
    private JwtHandler $jwt;

    public function __construct(mysqli $db)
    {
        $this->user = new User($db);
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
        $token = $this->jwt->generateToken(
            (int) $user['id'],
            $user['username']
        );

        return [
            'success' => true,
            'message' => 'Login successful.',
            'user' => [
                'id' => (int) $user['id'],
                'username' => $user['username']
            ],
            'accessToken' => $token
        ];
    }
}