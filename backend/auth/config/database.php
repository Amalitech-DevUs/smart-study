<?php

class Database
{
    private string $database;
    private string $schema;

    public PDO $connection;

    public function __construct()
    {
        $databasePath = getenv('AUTH_DB_PATH');
        $this->database = $databasePath !== false && $databasePath !== ''
            ? $databasePath
            : __DIR__ . '/../database/smart_study.sqlite';
        $this->schema = __DIR__ . '/../database/schema.sql';
    }

    public function connect(): PDO
    {
        $databaseDirectory = dirname($this->database);
        if (!is_dir($databaseDirectory) && !mkdir($databaseDirectory, 0775, true) && !is_dir($databaseDirectory)) {
            throw new RuntimeException('Unable to create the auth database directory.');
        }

        $this->connection = new PDO(
            'sqlite:' . $this->database
        );

        $this->connection->setAttribute(
            PDO::ATTR_ERRMODE,
            PDO::ERRMODE_EXCEPTION
        );

        $this->connection->setAttribute(
            PDO::ATTR_DEFAULT_FETCH_MODE,
            PDO::FETCH_ASSOC
        );

        // Enable foreign keys
        $this->connection->exec('PRAGMA foreign_keys = ON');

        // Create tables if they don't exist
        $this->initializeDatabase();

        return $this->connection;
    }

    private function initializeDatabase(): void
    {
        if (!file_exists($this->schema)) {
            throw new Exception('Database schema file not found.');
        }

        $schema = file_get_contents($this->schema);

        if ($schema === false) {
            throw new Exception('Unable to read database schema.');
        }

        $this->connection->exec($schema);
    }
}