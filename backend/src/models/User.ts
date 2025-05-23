import pool from '../database/connection';
import { User, CreateUserRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export class UserModel {
  static async getAll(): Promise<User[]> {
    const result = await pool.query(
      'SELECT id, email, name, created_at FROM users ORDER BY created_at DESC'
    );
    return result.rows;
  }

  static async getById(id: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async getByEmail(email: string): Promise<(User & { password: string }) | null> {
    const result = await pool.query(
      'SELECT id, email, password, name, created_at FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  static async create(userData: CreateUserRequest): Promise<User> {
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (id, email, password, name) VALUES ($1, $2, $3, $4) RETURNING id, email, name, created_at',
      [id, userData.email, hashedPassword, userData.name]
    );
    
    return result.rows[0];
  }

  static async update(id: string, updates: Partial<Omit<User, 'id'>>): Promise<User | null> {
    const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [id, ...Object.values(updates)];
    
    const result = await pool.query(
      `UPDATE users SET ${setClause} WHERE id = $1 RETURNING id, email, name, created_at`,
      values
    );
    
    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  static async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}