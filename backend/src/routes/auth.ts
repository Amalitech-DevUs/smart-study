import { Router, Request, Response } from 'express';

const router = Router();

// POST /auth/signup
router.post('/signup', (req: Request, res: Response) => {
  const { username, pin } = req.body;

  if (!username || !pin) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Username and PIN are required'
      }
    });
  }

  res.status(201).json({
    success: true,
    data: {
      message: 'Account created successfully',
      user: { id: 'user_101', username, createdAt: new Date().toISOString() }
    }
  });
});

// POST /auth/login
router.post('/login', (req: Request, res: Response) => {
  const { username, pin } = req.body;

  if (!username || !pin) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Username and PIN are required'
      }
    });
  }

  // Stub JWT issuance
  res.json({
    success: true,
    data: {
      token: 'mock_jwt_token_header.payload.signature',
      user: { id: 'user_101', username }
    }
  });
});

// GET /auth/me
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
