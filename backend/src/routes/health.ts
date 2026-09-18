import { Router, Request, Response } from 'express';
import { checkServiceHealth } from '../services/downstream';

const router = Router();

// GET /health - Summary health status across all downstream microservices
router.get('/', async (req: Request, res: Response) => {
  const authUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:5001/routes/auth.php';
  const contentUrl = process.env.CONTENT_SERVICE_URL || 'http://localhost:5002';
  const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:5003';

  const [authHealth, contentHealth, aiHealth] = await Promise.all([
    checkServiceHealth('auth', authUrl),
    checkServiceHealth('content', contentUrl),
    checkServiceHealth('ai-assistant', aiUrl)
  ]);

  const allHealthy = authHealth.status === 'HEALTHY' && contentHealth.status === 'HEALTHY' && aiHealth.status === 'HEALTHY';

  res.json({
    success: true,
    data: {
      overallStatus: allHealthy ? 'HEALTHY' : 'DEGRADED',
      services: {
        auth: authHealth,
        content: contentHealth,
        ai: aiHealth
      }
    },
    timestamp: new Date().toISOString()
  });
});

// GET /health/auth - Auth Service Health Flag
router.get('/auth', async (req: Request, res: Response) => {
  const authUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:5001/routes/auth.php';
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
