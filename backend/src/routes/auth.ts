import { Router, Request, Response } from 'express';
import { validate } from '../middleware/validate';
import { requireAuth, AuthenticatedRequest } from '../middleware/authMiddleware';
import { progressAttemptSchema, signupSchema, loginSchema } from '../schemas';

const router = Router();

const getAuthServiceUrl = () => process.env.AUTH_SERVICE_URL || 'http://localhost:5001/routes/auth.php';
const getAuthRestBaseUrl = () => process.env.AUTH_REST_BASE_URL || 'http://localhost:5001';

// POST /auth/signup - Validate payload with Zod schema and proxy to PHP Auth service (with local fallback)
router.post('/signup', validate({ body: signupSchema }), async (req: Request, res: Response) => {
  const { username, pin } = req.body;
  const phpAuthUrl = new URL(getAuthServiceUrl());
  phpAuthUrl.searchParams.set('action', 'signup');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(phpAuthUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, pin }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = (await response.json().catch(() => null)) as { success?: boolean; message?: string; error?: string; accessToken?: string; user?: Record<string, unknown> } | null;

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
        user: data.user || { username },
        token: data.accessToken
      }
    });
  } catch (error) {
    clearTimeout(timeoutId);
    return res.status(503).json({
      success: false,
      error: 'Authentication service is unavailable.'
    });
  }
});

// POST /auth/login - Validate payload with Zod schema and proxy to PHP Auth service (with local fallback)
router.post('/login', validate({ body: loginSchema }), async (req: Request, res: Response) => {
  const { username, pin } = req.body;
  const phpAuthUrl = new URL(getAuthServiceUrl());
  phpAuthUrl.searchParams.set('action', 'login');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
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
    clearTimeout(timeoutId);
    return res.status(503).json({
      success: false,
      error: 'Authentication service is unavailable.'
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

router.post('/progress/attempts', requireAuth, validate({ body: progressAttemptSchema }), async (req: AuthenticatedRequest, res: Response) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  const cookieToken = req.headers.cookie
    ?.split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('smart-study-token='))
    ?.slice('smart-study-token='.length);
  const authorization = req.headers.authorization || (cookieToken ? `Bearer ${decodeURIComponent(cookieToken)}` : '');

  try {
    const response = await fetch(new URL('/auth/progress/attempts', getAuthRestBaseUrl()), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization
      },
      body: JSON.stringify(req.body),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    const data = await response.json().catch(() => null);
    return res.status(response.status).json(data || { success: false, error: 'Invalid auth service response.' });
  } catch (error) {
    clearTimeout(timeoutId);
    return res.status(503).json({ success: false, error: 'Authentication service is unavailable.' });
  }
});

export default router;
