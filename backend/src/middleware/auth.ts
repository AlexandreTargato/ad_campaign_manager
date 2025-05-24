import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { User } from '../types';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const user = await AuthService.getUserFromToken(token);
    if (!user) {
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const user = await AuthService.getUserFromToken(token);
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // For optional auth, we don't want to fail the request
    // Just continue without setting req.user
    next();
  }
};
