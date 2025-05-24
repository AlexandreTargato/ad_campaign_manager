import jwt, { SignOptions } from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { CreateUserRequest, LoginRequest, AuthResponse, User } from '../types';

export class AuthService {
  private static readonly JWT_SECRET =
    process.env.JWT_SECRET || 'fallback-secret';
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

  static generateToken(userId: string): string {
    const options: SignOptions = {
      expiresIn: this.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    };
    return jwt.sign({ userId }, this.JWT_SECRET, options);
  }

  static verifyToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string };
      return decoded;
    } catch (error) {
      return null;
    }
  }

  static async register(userData: CreateUserRequest): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await UserModel.getByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const user = await UserModel.create(userData);
    const token = this.generateToken(user.id);

    return {
      user,
      token,
      message: 'User registered successfully',
    };
  }

  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Get user by email (including password for validation)
    const userWithPassword = await UserModel.getByEmail(credentials.email);
    if (!userWithPassword) {
      throw new Error('Invalid email or password');
    }

    // Validate password
    const isValidPassword = await UserModel.validatePassword(
      credentials.password,
      userWithPassword.password
    );
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Remove password from user object
    const { password, ...user } = userWithPassword;
    const token = this.generateToken(user.id);

    return {
      user,
      token,
      message: 'Login successful',
    };
  }

  static async getUserFromToken(token: string): Promise<User | null> {
    const decoded = this.verifyToken(token);
    if (!decoded) {
      return null;
    }

    return UserModel.getById(decoded.userId);
  }
}
