<?php

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/models/User.php';

$database = new Database();
$db = $database->connect();

$user = new User($db);

// Test creating a user
$userId = $user->create("testuser", "1234");

echo "User created successfully! ID: " . $userId;