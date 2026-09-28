import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { validate } from '../middleware/validate';
import { requireAuth, AuthenticatedRequest } from '../middleware/authMiddleware';
import { signupSchema, loginSchema } from '../schemas';

const router = Router();

const getAuthServiceUrl = () => process.env.AUTH_SERVICE_URL || 'http://localhost:5001/routes/auth.php';
const getJwtSecret = () => process.env.JWT_SECRET || 'super_secret_dev_key_bece_2026_production_key_32bytes';

// ── Offline Fallback Storage (JSON seed bank) ───────────────────────────────
const DATA_DIR = path.resolve(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

interface FallbackUser {
  id: number;
  username: string;
  pinHash: string;
  createdAt: string;
}

function getFallbackUsers(): FallbackUser[] {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(USERS_FILE, '[]', 'utf8');
      return [];
    }
    const content = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error('Error reading fallback users:', err);
    return [];
  }
}

function saveFallbackUsers(users: FallbackUser[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving fallback users:', err);
  }
}

function hashPin(pin: string): string {
  return crypto.createHash('sha256').update(pin + getJwtSecret()).digest('hex');
}

function generateFallbackJwt(userId: number, username: string): string {
  return jwt.sign(
    {
      user_id: userId,
      username: username,
    },
    getJwtSecret(),
    { expiresIn: '7d' }
  );
}

// POST /auth/signup - Validate payload with Zod schema and proxy to PHP Auth service (with local fallback)
router.post('/signup', validate({ body: signupSchema }), async (req: Request, res: Response) => {
  const { username, pin } = req.body;
  const phpAuthUrl = `${getAuthServiceUrl()}?action=signup`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(phpAuthUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, pin }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = (await response.json().catch(() => null)) as { success?: boolean; message?: string; error?: string; user?: Record<string, unknown> } | null;

    if (!response.ok || !data?.success) {
      const statusCode = response.status >= 400 ? response.status : 400;
      return res.status(statusCode).json({
        success: false,
        error: data?.message || data?.error || 'Signup failed'
      });
    }

    return res.status(201).json({
      success: true,
      data: {
        message: data.message || 'Account created successfully',
        user: data.user || { username }
      }
    });
  } catch (error) {
    console.warn('PHP Auth Microservice unreachable. Activating local Express auth fallback...');

    const users = getFallbackUsers();
    const existing = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());

    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Username is already taken'
      });
    }

    const newUser: FallbackUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      username: username.trim(),
      pinHash: hashPin(pin),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveFallbackUsers(users);

    const token = generateFallbackJwt(newUser.id, newUser.username);

    return res.status(201).json({
      success: true,
      data: {
        message: 'Account created successfully (Local Fallback)',
        token,
        user: {
          id: newUser.id,
          username: newUser.username
        },
        source: 'LOCAL_FALLBACK'
      }
    });
  }
});

// POST /auth/login - Validate payload with Zod schema and proxy to PHP Auth service (with local fallback)
router.post('/login', validate({ body: loginSchema }), async (req: Request, res: Response) => {
  const { username, pin } = req.body;
  const phpAuthUrl = `${getAuthServiceUrl()}?action=login`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(phpAuthUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, pin }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = (await response.json().catch(() => null)) as { success?: boolean; message?: string; error?: string; accessToken?: string; user?: Record<string, unknown> } | null;

    if (!response.ok || !data?.success) {
      const statusCode = response.status >= 400 ? response.status : 401;
      return res.status(statusCode).json({
        success: false,
        error: data?.message || data?.error || 'Invalid credentials'
      });
    }

    return res.json({
      success: true,
      data: {
        token: data.accessToken,
        user: data.user
      }
    });
  } catch (error) {
    console.warn('PHP Auth Microservice unreachable. Checking local Express auth fallback...');

    const users = getFallbackUsers();
    const user = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());

    if (!user || user.pinHash !== hashPin(pin)) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or PIN'
      });
    }

    const token = generateFallbackJwt(user.id, user.username);

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username
        },
        source: 'LOCAL_FALLBACK'
      }
    });
  }
});

// GET /auth/me - Return current user's info from verified JWT token
router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    data: {
      id: req.user?.user_id,
      username: req.user?.username
    }
  });
});

export default router;
