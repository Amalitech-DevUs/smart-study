import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validate';
import { chatMessageSchema } from '../schemas';
import { forwardChatToAiService } from '../services/downstream';

const router = Router();

// POST /chat - AI Study Assistant endpoint connecting to Python AI microservice
router.post('/', validate({ body: chatMessageSchema }), async (req: Request, res: Response, next: NextFunction) => {
  const { message, conversationHistory } = req.body;

  try {
    const aiResponse = await forwardChatToAiService({
      message,
      ...(conversationHistory ? { messages: conversationHistory } : {})
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json().catch(() => null);
      return res.status(aiResponse.status).json({
        success: false,
        error: {
          code: 'AI_SERVICE_ERROR',
          message: errorData?.detail?.error || 'AI Assistant service returned an error',
          details: errorData
        }
      });
    }

    const contentType = aiResponse.headers.get('content-type') || '';

    // If downstream returns an SSE stream, pipe chunks through directly to the frontend
    if (contentType.includes('text/event-stream') && aiResponse.body) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = (aiResponse.body as any).getReader
        ? (aiResponse.body as any).getReader()
        : null;

      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
        } finally {
          res.end();
        }
        return;
      } else if ((aiResponse.body as any).pipe) {
        (aiResponse.body as any).pipe(res);
        return;
      }
    }

    // Pass JSON payload through
    const jsonData = await aiResponse.json();
    return res.json({
      success: true,
      data: jsonData
    });
  } catch (error: any) {
    // Graceful fallback if AI microservice is not yet running
    return res.json({
      success: true,
      data: {
        reply: `Smart Study AI tutor is currently offline. Please ensure the AI backend server is running. In the meantime, you can explore flashcards or practice questions related to "${message}".`,
        role: 'assistant',
        source: 'offline-fallback',
        timestamp: new Date().toISOString()
      }
    });
  }
});

export default router;
