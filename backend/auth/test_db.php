<?php

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/models/user.php';

$database = new Database();
$db = $database->connect();

$user = new User($db);

$testName = "testuser_" . time();
$userId = $user->create($testName, "1234");

echo "User created successfully in SQLite! ID: " . $userId . " username: " . $testName;