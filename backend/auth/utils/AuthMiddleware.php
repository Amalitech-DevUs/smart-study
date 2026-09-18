<?php

require_once __DIR__ . '/JwtHandler.php';

class AuthMiddleware
{
    public static function authenticate(): object
    {
        $headers = getallheaders();

        $authorization = $headers['Authorization']
            ?? $headers['authorization']
            ?? '';

        if ($authorization === '') {
            http_response_code(401);

            echo json_encode([
                'success' => false,
                'message' => 'Authorization token is required.'
            ]);

            exit;
        }

        if (!str_starts_with($authorization, 'Bearer ')) {
            http_response_code(401);

            echo json_encode([
                'success' => false,
                'message' => 'Invalid authorization format.'
            ]);

            exit;
        }

        $token = trim(substr($authorization, 7));

        if ($token === '') {
            http_response_code(401);

            echo json_encode([
                'success' => false,
                'message' => 'Token is missing.'
            ]);

            exit;
        }

        try {
            $jwt = new JwtHandler();

            return $jwt->validateToken($token);

        } catch (Exception $e) {
            http_response_code(401);

            echo json_encode([
                'success' => false,
                'message' => 'Invalid or expired token.'
            ]);

            exit;
        }
    }
}