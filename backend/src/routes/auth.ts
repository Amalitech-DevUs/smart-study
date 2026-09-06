import { Router, Request, Response } from 'express';
import { validate } from '../middleware/validate';
import { signupSchema, loginSchema } from '../schemas';

const router = Router();

// POST /auth/signup - Validate payload with Zod schema
router.post('/signup', validate({ body: signupSchema }), async (req: Request, res: Response) => {
  const { username, pin } = req.body;

  res.status(201).json({
    success: true,
    data: {
      message: 'Account created successfully',
      user: { id: `user_${Date.now()}`, username, createdAt: new Date().toISOString() }
    }
  });
});

// POST /auth/login - Validate payload with Zod schema
router.post('/login', validate({ body: loginSchema }), async (req: Request, res: Response) => {
  const { username } = req.body;

  // Contract: Returns JWT token and user info
  res.json({
    success: true,
    data: {
      token: 'mock_jwt_token_header.payload.signature',
      user: { id: 'user_101', username }
    }
  });
});

// GET /auth/me - Return current user's info
router.get('/me', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      id: 'user_101',
      username: 'bece_student'
    }
  });
});

export default router;
