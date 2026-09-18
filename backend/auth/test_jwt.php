<?php

require_once __DIR__ . '/utils/JwtHandler.php';

try {
    $jwt = new JwtHandler();

    $token = $jwt->generateToken(1, 'testuser');

    echo $token;
} catch (Exception $e) {
    echo "JWT Error: " . $e->getMessage();
}