import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './errorHandler';

interface ValidationTarget {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export const validate = (targets: ValidationTarget) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (targets.body) {
        req.body = await targets.body.parseAsync(req.body);
      }
      if (targets.query) {
        req.query = await targets.query.parseAsync(req.query);
      }
      if (targets.params) {
        req.params = await targets.params.parseAsync(req.params);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }));

        const appError: AppError = new Error('Invalid request parameters');
        appError.statusCode = 400;
        appError.code = 'VALIDATION_ERROR';
        appError.details = formattedErrors;
        return next(appError);
      }
      next(error);
    }
  };
};
