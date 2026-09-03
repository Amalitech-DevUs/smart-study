import { Router, Request, Response } from 'express';

const router = Router();

// POST /chat - AI Study Assistant endpoint proxy stub
router.post('/', (req: Request, res: Response) => {
  const { message, conversationHistory } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Request payload must include a valid string "message"'
      }
    });
  }

  // Mock response until connected to AI Assistant service in Layer 1/2
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
