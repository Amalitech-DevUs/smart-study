# Auth Microservice

The **Auth Microservice** handles user registration, PIN-based authentication, and JWT session token generation for the **Smart-Study** BECE learning platform.

* **Default Port:** `5001`
* **Runtime:** PHP 8.0+
* **Database:** SQLite (`smart_study.sqlite`) via PDO
* **Token Standard:** JSON Web Tokens (JWT) using `firebase/php-jwt`

---

## Architecture & Design Decisions

### 1. Child-Friendly PIN Authentication
Instead of requiring complex passwords with symbols and mixed cases (which creates high friction for Junior High School students), the platform uses a **Username + 4 to 6-digit numeric PIN**.
PINs are securely hashed and salted using PHP's native `password_hash()` with `PASSWORD_DEFAULT` (bcrypt).

### 2. Embedded SQLite Database (Zero-Config Setup)
The service previously used MySQL but has been refactored to **SQLite**. 
* **No external database server (MySQL/PostgreSQL) is required.**
* The database file is located at `database/smart_study.sqlite`.
* On the first connection, `Database::connect()` automatically executes `database/schema.sql` to initialize all tables if they do not already exist.

---

## Directory Structure

```
backend/auth/
├── config/
│   └── database.php        # SQLite PDO connection & auto-migration
├── controllers/
│   └── AuthController.php  # Signup, login, & token issuance logic
├── database/
│   ├── schema.sql          # Table definitions (users, tokens, attempts, etc.)
│   └── smart_study.sqlite  # SQLite database file (auto-generated)
├── models/
│   └── user.php            # User model (create, findByUsername, verifyPin)
├── routes/
│   ├── auth.php            # Action-based router (?action=signup | ?action=login)
│   └── index.php           # REST path router (/auth/signup, /auth/login, /auth/me)
├── utils/
│   ├── AuthMiddleware.php  # Bearer token validator for protected routes
│   └── jwt.php             # JWT encode / decode helpers
├── vendor/                 # Composer dependencies
├── composer.json           # PHP dependencies (firebase/php-jwt, vlucas/phpdotenv)
├── test_db.php             # Quick CLI test to verify database operations
└── test_jwt.php            # Quick CLI test to verify JWT signing & decoding
```

---

## Getting Started

### Prerequisites
* **PHP 8.0+** with `pdo_sqlite` extension enabled (standard in all modern PHP installations).
* **Composer** (optional; dependencies are already included in `vendor/`).

Verify PHP and SQLite support:
```bash
php -v
php -m | grep -i pdo_sqlite
```

### Running the Service Locally
From the `backend/auth` directory, start PHP's built-in development server on port **5001**:

```bash
cd backend/auth
php -S localhost:5001
```

> **Note:** Do not close this terminal while testing authentication through the frontend or Express gateway.

---

## API Endpoints Reference

The service supports both query-action routing (used by the Express Gateway) and direct REST-path routing.

### 1. User Registration (Signup)

* **Endpoints:** 
  * `POST http://localhost:5001/routes/auth.php?action=signup` *(Gateway mode)*
  * `POST http://localhost:5001/auth/signup` *(REST mode)*
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "username": "kofi_mensah",
  "pin": "1234"
}
```

* **Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "user": {
    "id": 1,
    "username": "kofi_mensah"
  }
}
```

* **Error Response (`409 Conflict`):**
```json
{
  "success": false,
  "message": "Username already exists."
}
```

---

### 2. User Login

* **Endpoints:** 
  * `POST http://localhost:5001/routes/auth.php?action=login` *(Gateway mode)*
  * `POST http://localhost:5001/auth/login` *(REST mode)*
* **Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "username": "kofi_mensah",
  "pin": "1234"
}
```

* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Login successful.",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": 1,
    "username": "kofi_mensah"
  }
}
```

* **Error Response (`401 Unauthorized`):**
```json
{
  "success": false,
  "message": "Invalid username or PIN."
}
```

---

### 3. Verify Session / Current User

* **Endpoint:** `GET http://localhost:5001/auth/me`
* **Headers:** `Authorization: Bearer <accessToken>`
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "kofi_mensah"
  }
}
```

---

## Integration with Express Gateway

The Node.js/Express backend (`backend/src/routes/auth.ts`) acts as the secure entry point:

1. **Frontend (`localhost:3000`)** sends `/auth/signup` or `/auth/login` to **Express (`localhost:5000`)**.
2. **Express** validates the payload with Zod schemas.
3. **Express** forwards the payload to `http://localhost:5001/routes/auth.php?action={signup|login}`.
4. If port 5001 is reachable, Express returns the PHP response directly to the student's browser.

---

## Sanity Testing

You can test database and token generation directly from the command line:

```bash
# Test SQLite database creation and user insertion
php test_db.php

# Test JWT token generation and decoding
php test_jwt.php
```
