import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../services/jwtSecret';

export interface AuthenticatedRequest extends Request {
  user?: {
    user_id: number;
    username: string;
    [key: string]: unknown;
  };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.headers.cookie) {
    // Parse smart-study-token cookie if passed directly
    const cookies = Object.fromEntries(
      req.headers.cookie.split(';').map((c) => {
        const [k, ...v] = c.trim().split('=');
        return [k, v.join('=')];
      })
    );
    token = cookies['smart-study-token'];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing authentication token'
    });
  }

  const secret = getJwtSecret();
  if (!secret) {
    return res.status(500).json({
      success: false,
      error: 'Authentication service is not configured'
    });
  }

  try {
    const decoded = jwt.verify(token, secret) as { user_id: number; username: string };

    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or expired authentication token'
    });
  }
}
