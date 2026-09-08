import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validate';
import { questionsQuerySchema, questionIdParamsSchema } from '../schemas';
import { fetchQuestions } from '../services/downstream';
import questionsData from '../data/questions.json';

const router = Router();

// GET /questions - Fetch questions with validated query params & service composition
router.get('/', validate({ query: questionsQuerySchema }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subject, year, topic } = req.query as { subject?: string; year?: number; topic?: string };
    const { data, source } = await fetchQuestions({ subject, year, topic });

    res.json({
      success: true,
      data,
      meta: {
        count: Array.isArray(data) ? data.length : 0,
        source,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /questions/:id - Fetch single question by ID
router.get('/:id', validate({ params: questionIdParamsSchema }), async (req: Request, res: Response) => {
  const question = questionsData.find(q => q.id === req.params.id);
  if (!question) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'QUESTION_NOT_FOUND',
        message: `Question with ID ${req.params.id} was not found`
      }
    });
  }

  res.json({
    success: true,
    data: question
  });
});

export default router;
