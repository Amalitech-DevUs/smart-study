import { Router, Request, Response } from 'express';
import { validate } from '../middleware/validate';
import { chatMessageSchema } from '../schemas';

const router = Router();

// POST /chat - AI Study Assistant endpoint with payload validation and microservice proxy
router.post('/', validate({ body: chatMessageSchema }), async (req: Request, res: Response) => {
  const { message } = req.body;
  const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const aiResponse = await fetch(`${aiServiceUrl.replace(/\/$/, '')}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // If streaming SSE from AI service, pipe it through to client
    const contentType = aiResponse.headers.get('content-type') || '';
    if (aiResponse.ok && contentType.includes('text/event-stream')) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      if (aiResponse.body) {
        // Node / Web stream pipe
        const reader = (aiResponse.body as any).getReader ? (aiResponse.body as any).getReader() : null;
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          return res.end();
        } else if ((aiResponse.body as any).pipe) {
          return (aiResponse.body as any).pipe(res);
        }
      }
    }

    if (aiResponse.ok) {
      const data = await aiResponse.json().catch(() => null);
      if (data) {
        return res.json({
          success: true,
          data: {
            reply: data.reply || data.content || data.message,
            role: 'assistant',
            timestamp: new Date().toISOString()
          }
        });
      }
    }
  } catch (error) {
    // Graceful fallback to tutor guidance if AI assistant service is offline
  }

  // Graceful fallback response when AI service is unavailable
  const fallbackReply = `Hello! I am your BECE Study Assistant. For your question on "${message}": remember to break down the problem into smaller parts, define key terms, and review relevant past BECE questions. I am currently operating in offline mode.`;

  res.json({
    success: true,
    data: {
      reply: fallbackReply,
      role: 'assistant',
      source: 'local_fallback',
      timestamp: new Date().toISOString()
    }
  });
});

export default router;
