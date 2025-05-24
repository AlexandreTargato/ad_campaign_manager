import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { CreateUserRequest, LoginRequest } from '../types';

export class AuthController {
  static async register(request: Request, response: Response): Promise<void> {
    try {
      const { email, password, name }: CreateUserRequest = request.body;

      const result = await AuthService.register({ email, password, name });

      response.status(201).json(result);
    } catch (error: any) {
      console.error('Registration error:', error);

      if (error.message === 'User with this email already exists') {
        response.status(409).json({ error: error.message });
        return;
      }

      response.status(500).json({ error: 'Internal server error' });
    }
  }

  static async login(request: Request, response: Response): Promise<void> {
    try {
      const { email, password }: LoginRequest = request.body;

      const result = await AuthService.login({ email, password });

      response.json(result);
    } catch (error: any) {
      console.error('Login error:', error);

      if (error.message === 'Invalid email or password') {
        response.status(401).json({ error: error.message });
        return;
      }

      response.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getProfile(request: Request, response: Response): Promise<void> {
    try {
      // User is attached to request by auth middleware
      response.json({
        user: request.user,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      response.status(500).json({ error: 'Internal server error' });
    }
  }

  static async refreshToken(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      if (!request.user) {
        response.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const newToken = AuthService.generateToken(request.user.id);

      response.json({
        token: newToken,
        user: request.user,
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      response.status(500).json({ error: 'Internal server error' });
    }
  }
}
