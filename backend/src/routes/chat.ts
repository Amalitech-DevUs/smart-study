import { Router, Request, Response } from 'express';
import { validate } from '../middleware/validate';
import { chatMessageSchema } from '../schemas';

const router = Router();

// POST /chat - AI Study Assistant endpoint with payload validation
router.post('/', validate({ body: chatMessageSchema }), async (req: Request, res: Response) => {
  const { message } = req.body;

  const mockReply = `Hello! As your BECE Study Assistant, here is guidance on your question: "${message}". Make sure to break down the topic, review past flashcards on this subject, and practice past questions!`;

  res.json({
    success: true,
    data: {
      reply: mockReply,
      role: 'assistant',
      timestamp: new Date().toISOString()
    }
  });
});

export default router;
