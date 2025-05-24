import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { CreateUserRequest, LoginRequest } from '../types';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name }: CreateUserRequest = req.body;

      // Basic validation
      if (!email || !password || !name) {
        res.status(400).json({
          error: 'Email, password, and name are required',
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          error: 'Password must be at least 6 characters long',
        });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          error: 'Please provide a valid email address',
        });
        return;
      }

      const result = await AuthService.register({ email, password, name });

      res.status(201).json({
        message: 'User created successfully',
        ...result,
      });
    } catch (error: any) {
      console.error('Registration error:', error);

      if (error.message === 'User with this email already exists') {
        res.status(409).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginRequest = req.body;

      if (!email || !password) {
        res.status(400).json({
          error: 'Email and password are required',
        });
        return;
      }

      const result = await AuthService.login({ email, password });

      res.json({
        message: 'Login successful',
        ...result,
      });
    } catch (error: any) {
      console.error('Login error:', error);

      if (error.message === 'Invalid email or password') {
        res.status(401).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      // User is attached to request by auth middleware
      res.json({
        user: req.user,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const newToken = AuthService.generateToken(req.user.id);

      res.json({
        token: newToken,
        user: req.user,
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
