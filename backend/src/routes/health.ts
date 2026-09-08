import { Router, Request, Response } from 'express';
import { checkServiceHealth } from '../services/downstream';

const router = Router();

// GET /health/auth - Auth Service Health Flag
router.get('/auth', async (req: Request, res: Response) => {
  const authUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:5001';
  const health = await checkServiceHealth('auth', authUrl);
  res.json({
    success: true,
    data: health,
    timestamp: new Date().toISOString()
  });
});

// GET /health/content - Content DB Service Health Flag
router.get('/content', async (req: Request, res: Response) => {
  const contentUrl = process.env.CONTENT_SERVICE_URL || 'http://localhost:5002';
  const health = await checkServiceHealth('content', contentUrl);
  res.json({
    success: true,
    data: health,
    timestamp: new Date().toISOString()
  });
});

// GET /health/ai - AI Assistant Service Health Flag
router.get('/ai', async (req: Request, res: Response) => {
  const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:5003';
  const health = await checkServiceHealth('ai-assistant', aiUrl);
  res.json({
    success: true,
    data: health,
    timestamp: new Date().toISOString()
  });
});

export default router;
