# Auth Microservice

The **Auth Microservice** handles user registration, PIN-based authentication, and JWT session token generation for the **Smart-Study** BECE learning platform.

* **Default Port:** `5001`
* **Runtime:** PHP 8.0+
* **Database:** SQLite (`smart_study.sqlite`) via PDO
* **Token Standard:** JSON Web Tokens (JWT) using `firebase/php-jwt`

---

## Docker Deployment

The Docker image runs PHP 8.3 with Apache and SQLite support. SQLite data is kept in the `auth_database` named volume, so rebuilding or replacing the container does not remove user data.

1. Copy `.env.example` to `.env` and replace `JWT_SECRET` with a unique random value. For example, generate one with `php -r "echo bin2hex(random_bytes(32)), PHP_EOL;"`.
2. Build and start the service from this directory:

```bash
docker compose up -d --build
```

The service is available at `http://localhost:5001` by default. Set `AUTH_PORT` in `.env` to change the host port. Both `/routes/auth.php?action=signup` and the rewritten REST paths such as `/auth/signup` are supported. Compose creates the shared Docker network `smart-study-services`; connect the gateway container to that network to resolve the auth service as `http://auth`.

For a host-based Express backend, use `AUTH_SERVICE_URL=http://localhost:5001/routes/auth.php` and `AUTH_REST_BASE_URL=http://localhost:5001`. For a gateway container attached to `smart-study-services`, use `AUTH_SERVICE_URL=http://auth/routes/auth.php` and `AUTH_REST_BASE_URL=http://auth`. Configure the exact same `JWT_SECRET` in the auth container, Express backend, and Next.js server.

The root `render.yaml` also defines this Docker service for Render. It stores SQLite at `/var/lib/smart-study/smart_study.sqlite` on an attached persistent disk, leaving `database/schema.sql` in the image. Set a random `JWT_SECRET` of at least 32 characters in Render and use the same value in the Express and Next.js services. Render persistent disks require a paid web-service plan, limit the service to one instance, and cause brief downtime during deploys.

Stop the service with `docker compose down`; this keeps the database volume. `docker compose down -v` also deletes the database and all stored auth data.

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
