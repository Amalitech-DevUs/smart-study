import { Router, Request, Response } from 'express';
import { validate } from '../middleware/validate';
import { requireAuth, AuthenticatedRequest } from '../middleware/authMiddleware';
import { signupSchema, loginSchema } from '../schemas';

const router = Router();

const getAuthServiceUrl = () => process.env.AUTH_SERVICE_URL || 'http://localhost:5001/routes/auth.php';

// POST /auth/signup - Validate payload with Zod schema and proxy to PHP Auth service
router.post('/signup', validate({ body: signupSchema }), async (req: Request, res: Response) => {
  const { username, pin } = req.body;
  const phpAuthUrl = `${getAuthServiceUrl()}?action=signup`;

  try {
    const response = await fetch(phpAuthUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, pin }),
    });

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
    console.error('Error connecting to PHP Auth Microservice:', error);
    return res.status(502).json({
      success: false,
      error: 'Unable to reach Auth Microservice'
    });
  }
});

// POST /auth/login - Validate payload with Zod schema and proxy to PHP Auth service
router.post('/login', validate({ body: loginSchema }), async (req: Request, res: Response) => {
  const { username, pin } = req.body;
  const phpAuthUrl = `${getAuthServiceUrl()}?action=login`;

  try {
    const response = await fetch(phpAuthUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, pin }),
    });

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
    console.error('Error connecting to PHP Auth Microservice:', error);
    return res.status(502).json({
      success: false,
      error: 'Unable to reach Auth Microservice'
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
