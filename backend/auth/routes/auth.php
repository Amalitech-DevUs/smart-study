<?php

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/AuthController.php';

$database = new Database();
$db = $database->connect();

$authController = new AuthController($db);

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);

    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed.'
    ]);

    exit();
}

// Get JSON request body
$input = json_decode(file_get_contents('php://input'), true);

$username = trim($input['username'] ?? '');
$pin = trim($input['pin'] ?? '');

// Basic validation
if ($username === '' || $pin === '') {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Username and PIN are required.'
    ]);

    exit();
}

// Determine requested action
$action = $_GET['action'] ?? '';

if ($action === 'signup') {

    $response = $authController->signup($username, $pin);

    http_response_code($response['success'] ? 201 : 409);

    echo json_encode($response);

} elseif ($action === 'login') {

    $response = $authController->login($username, $pin);

    http_response_code($response['success'] ? 200 : 401);

    echo json_encode($response);

} else {

    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Invalid action.'
    ]);
}