import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validate';
import { articlesQuerySchema, articleIdParamsSchema } from '../schemas';
import { fetchArticles, fetchArticleByIdOrSlug } from '../services/downstream';

const router = Router();

// GET /articles - List educational articles with validation & service composition
router.get('/', validate({ query: articlesQuerySchema }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, subject } = req.query as { category?: string; subject?: string };
    const { data, source } = await fetchArticles({ category, subject });

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

// GET /articles/:id - Fetch single article by ID or Slug
router.get('/:id', validate({ params: articleIdParamsSchema }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, source } = await fetchArticleByIdOrSlug(req.params.id);
    if (!data) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ARTICLE_NOT_FOUND',
          message: `Article with ID or slug '${req.params.id}' was not found`
        }
      });
    }

    res.json({
      success: true,
      data,
      meta: {
        source,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
