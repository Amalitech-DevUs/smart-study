<?php

class Database
{
    private string $host;
    private int $port;
    private string $username;
    private string $password;
    private string $database;

    public mysqli $connection;

    public function __construct()
    {
        $this->host = $_ENV['DB_HOST'] ?? $_SERVER['DB_HOST'] ?? '127.0.0.1';
        $this->port = (int)($_ENV['DB_PORT'] ?? $_SERVER['DB_PORT'] ?? 3307);
        $this->username = $_ENV['DB_USER'] ?? $_SERVER['DB_USER'] ?? 'root';
        $this->password = $_ENV['DB_PASS'] ?? $_SERVER['DB_PASS'] ?? 'Akunini@2456';
        $this->database = $_ENV['DB_NAME'] ?? $_SERVER['DB_NAME'] ?? 'smart_study';
    }

    public function connect(): mysqli
    {
        $this->connection = @new mysqli(
            $this->host,
            $this->username,
            $this->password,
            $this->database,
            $this->port
        );

        if ($this->connection->connect_error) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'message' => "Database connection failed: " . $this->connection->connect_error
            ]);
            exit();
        }

        $this->connection->set_charset("utf8mb4");

        return $this->connection;
    }
}