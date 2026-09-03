import { Router, Request, Response } from 'express';

const router = Router();

// /health/auth - Auth Service Health Flag
router.get('/auth', (req: Request, res: Response) => {
  res.json({
    service: 'auth',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// /health/content - Content DB Service Health Flag
router.get('/content', (req: Request, res: Response) => {
  res.json({
    service: 'content',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// /health/ai - AI Assistant Service Health Flag
router.get('/ai', (req: Request, res: Response) => {
  res.json({
    service: 'ai-assistant',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

export default router;
