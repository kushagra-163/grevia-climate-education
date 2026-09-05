import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { UserProfile } from '../models/UserProfile';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';

export interface SignupDTO {
  name: string;
  email: string;
  password: string;
  role?: 'student' | 'teacher' | 'admin';
  age?: number;
  country?: string;
  city?: string;
  language?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export class AuthService {
  static async signup(data: SignupDTO) {
    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      throw new AppError('Email address is already registered', 400, 'EMAIL_EXISTS');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role || 'student',
      age: data.age,
      country: data.country || 'Global',
      city: data.city || 'Earth',
      language: data.language || 'en',
    });

    await UserProfile.create({
      userId: user._id,
    });

    const tokens = this.generateTokens(user);
    return { user: this.sanitizeUser(user), tokens };
  }

  static async login(data: LoginDTO) {
    const user = await User.findOne({ email: data.email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const tokens = this.generateTokens(user);
    return { user: this.sanitizeUser(user), tokens };
  }

  static async refresh(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { id: string };
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new AppError('User no longer exists', 401, 'USER_NOT_FOUND');
      }

      const tokens = this.generateTokens(user);
      return { user: this.sanitizeUser(user), tokens };
    } catch (error) {
      throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }
  }

  static generateTokens(user: IUser) {
    const accessToken = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user._id.toString() },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  static sanitizeUser(user: IUser) {
    const obj = user.toObject();
    delete obj.passwordHash;
    return obj;
  }
}
