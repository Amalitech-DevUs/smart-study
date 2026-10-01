# CI Requirements - Smart Study

## Branches

- Default branch: `main`
- CI branches: `main`, `develop`

## Services

### 1. Frontend

- Folder path: `frontend`
- Language/runtime + version: Node.js 22
- Package manager: npm
- Lint command: `npm run lint`
- Build command: `npm run build`
- Test command: no tests exist yet
- Environment variables needed to install/build/lint: `N/A`

### 2. Routing Layer (Node/Express)

- Folder path: `backend`
- Language/runtime + version: Node.js 22, TypeScript
- Package manager: npm
- Lint command: `N/A` because no lint script exists
- Build command: `npm run build`
- Test command: no tests exist yet
- Environment variables needed to install/lint/test: `N/A`

Runtime variables used by the service are `JWT_SECRET`, `AUTH_SERVICE_URL`, and
`CONTENT_SERVICE_URL`, but they are not required to compile the routing layer.

### 3. Auth Service (PHP)

- Folder path: `backend/auth`
- PHP version: `N/A` explicitly; PHP 8.1+ is recommended because the code uses typed properties
- Framework: plain PHP
- Dependency manager: Composer
- Lint/static analysis tool and command: `N/A`
- Test framework and command: no formal test framework; manual checks are `php test_db.php` and `php test_jwt.php`
- Does running tests require a real database connection?: no
- Database: local SQLite at `backend/auth/database/smart_study.sqlite`
- Migrations: no; the schema is initialized automatically from `schema.sql`

The PHP SQLite PDO extension must be enabled.

### 4. Content Database Service (Python/FastAPI)

- Folder path: `backend/content/content-database`
- Python version: 3.11
- Dependency manager: pip with `requirements.txt`
- Lint tool and command: `N/A`
- Test framework and command: no tests exist yet
- Does running tests require a real Postgres database?: no
- Connection string environment variable: `DATABASE_URL`; it defaults to local SQLite
- Does CI need to run Alembic migrations before tests?: no, because there are currently no automated tests

### 5. AI Assistant Service (Python)

- Folder path: `backend/ai-assistant`
- Python version: 3.10+
- Dependency manager: uv with `pyproject.toml` and `uv.lock`
- Lint tool and command: `N/A`
- Test framework and command: pytest is declared as a development dependency, but no tests exist yet
- Does it need API keys just to import/lint/test?: no
- Does it need a database connection for tests?: no; ChromaDB uses a local directory when available

Runtime provider keys are `GROQ_API_KEY` or `OPENROUTER_API_KEY`.

## CI Behavior Preferences

- Use path-filtered jobs so each service runs only when its own folder changes.
- Lint failures should block the relevant job.
- No service currently needs a non-blocking test job because automated test suites do not exist yet.

## Secrets

- Frontend: `N/A`
- Routing layer: `N/A` for the current build/lint/test checks
- Auth service: `JWT_SECRET` if CI tests are expanded to use a custom secret
- Content database: `N/A`
- AI assistant: `GROQ_API_KEY` or `OPENROUTER_API_KEY`

## Build Log

`frontend/build_output.log` is a generated UTF-16LE log containing output from
the Next.js build command. It is not an application input or runtime dependency.