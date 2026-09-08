<?php

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../utils/AuthMiddleware.php';


$database = new Database();
$db = $database->connect();

$authController = new AuthController($db);

$method = $_SERVER['REQUEST_METHOD'];

// Get the requested path
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove the part before /auth/
$position = strpos($path, '/auth/');

if ($position !== false) {
    $path = substr($path, $position);
}

// Remove trailing slash
$path = rtrim($path, '/');


/*
|--------------------------------------------------------------------------
| POST /auth/signup
|--------------------------------------------------------------------------
*/

if ($method === 'POST' && $path === '/auth/signup') {

    $input = json_decode(file_get_contents('php://input'), true);

    $username = trim($input['username'] ?? '');
    $pin = trim($input['pin'] ?? '');

    if ($username === '' || $pin === '') {
        http_response_code(400);

        echo json_encode([
            'success' => false,
            'message' => 'Username and PIN are required.'
        ]);

        exit;
    }

    $response = $authController->signup($username, $pin);

    http_response_code($response['success'] ? 201 : 409);

    echo json_encode($response);

    exit;
}


/*
|--------------------------------------------------------------------------
| POST /auth/login
|--------------------------------------------------------------------------
*/

if ($method === 'POST' && $path === '/auth/login') {

    $input = json_decode(file_get_contents('php://input'), true);

    $username = trim($input['username'] ?? '');
    $pin = trim($input['pin'] ?? '');

    if ($username === '' || $pin === '') {
        http_response_code(400);

        echo json_encode([
            'success' => false,
            'message' => 'Username and PIN are required.'
        ]);

        exit;
    }

    $response = $authController->login($username, $pin);

    http_response_code($response['success'] ? 200 : 401);

    echo json_encode($response);

    exit;
}

if ($method === 'POST' && str_ends_with($path, '/auth/refresh')) {

    $input = json_decode(file_get_contents('php://input'), true);

    $refreshToken = trim($input['refreshToken'] ?? '');

    if ($refreshToken === '') {
        http_response_code(400);

        echo json_encode([
            'success' => false,
            'message' => 'Refresh token is required.'
        ]);

        exit;
    }

    $response = $authController->refresh($refreshToken);

    http_response_code($response['success'] ? 200 : 401);

    echo json_encode($response);

    exit;
}


if ($method === 'GET' && str_ends_with($path, '/auth/me')) {

    $tokenData = AuthMiddleware::authenticate();

    echo json_encode([
        'success' => true,
        'user' => [
            'id' => (int) $tokenData->user_id,
            'username' => $tokenData->username
        ]
    ]);

    exit;
}
/*
|--------------------------------------------------------------------------
| Route not found
|--------------------------------------------------------------------------
*/

http_response_code(404);

echo json_encode([
    'success' => false,
    'message' => 'Endpoint not found.'
]);