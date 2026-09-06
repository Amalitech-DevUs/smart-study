import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validate';
import { articlesQuerySchema, articleIdParamsSchema } from '../schemas';
import { fetchArticles } from '../services/downstream';
import articlesData from '../data/articles.json';

const router = Router();

// GET /articles - List educational articles with validation & service composition
router.get('/', validate({ query: articlesQuerySchema }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query as { category?: string };
    const { data, source } = await fetchArticles(category);

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

// GET /articles/:id - Fetch single article by ID
router.get('/:id', validate({ params: articleIdParamsSchema }), async (req: Request, res: Response) => {
  const article = articlesData.find(a => a.id === req.params.id);
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
