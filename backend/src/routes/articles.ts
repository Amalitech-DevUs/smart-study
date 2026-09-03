import { Router, Request, Response } from 'express';

const router = Router();

const mockArticles = [
  {
    id: 'art-1',
    title: 'Mastering Computer Literacy for BECE ICT',
    category: 'ICT',
    body: 'Computer literacy is essential for candidates sitting for the BECE. Key concepts include understanding hardware components, software classification, network fundamentals, and internet safety...',
    publishedAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'art-2',
    title: 'Effective Examination Revision Techniques',
    category: 'Study Skills',
    body: 'Spaced repetition using flashcards, active recall, and practicing past questions under timed conditions have proven to significantly boost retention and performance in exams.',
    publishedAt: '2026-08-20T14:30:00Z'
  }
];

// GET /articles - List educational articles
router.get('/', (req: Request, res: Response) => {
  const { category } = req.query;
  let result = mockArticles;

  if (category) {
    result = result.filter(a => a.category.toLowerCase() === (category as string).toLowerCase());
  }

  res.json({
    success: true,
    data: result,
    meta: {
      count: result.length,
      timestamp: new Date().toISOString()
    }
  });
});

// GET /articles/:id - Fetch single article
router.get('/:id', (req: Request, res: Response) => {
  const article = mockArticles.find(a => a.id === req.params.id);
  if (!article) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'ARTICLE_NOT_FOUND',
        message: `Article with ID ${req.params.id} was not found`
      }
    });
  }

  res.json({
    success: true,
    data: article
  });
});

export default router;
