<?php

class Database
{
    private string $host = 'localhost';
    private string $username = 'root';
    private string $password = '';
    private string $database = 'smart_study';

    public mysqli $connection;

    public function connect(): mysqli
    {
        $this->connection = new mysqli(
            $this->host,
            $this->username,
            $this->password,
            $this->database
        );

        if ($this->connection->connect_error) {
            die("Database connection failed: " . $this->connection->connect_error);
        }

        $this->connection->set_charset("utf8mb4");

        return $this->connection;
    }
}