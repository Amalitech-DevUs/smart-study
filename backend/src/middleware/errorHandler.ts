import { Request, Response, NextFunction } from 'express';  

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';

  console.error(`[Error] ${req.method} ${req.url} - ${code}: ${message}`);

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details: err.details || null,
      timestamp: new Date().toISOString()
    }
  });
};
