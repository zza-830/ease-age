import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];
const JWT_REFRESH_EXPIRES_IN = '30d' as SignOptions['expiresIn'];

export class AuthService {
  async register(data: {
    phoneNumber: string;
    password: string;
    fullName: string;
    role: string;
  }) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber: data.phoneNumber },
    });

    if (existingUser) {
      throw new AppError(400, '该手机号已注册');
    }

    // Hash password
    const password = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        phoneNumber: data.phoneNumber,
        password,
        fullName: data.fullName,
        role: data.role,
      },
    });

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.role);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(data: { phoneNumber: string; password: string }) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { phoneNumber: data.phoneNumber },
    });

    if (!user) {
      throw new AppError(401, '手机号或密码错误');
    }

    if (!user.isActive) {
      throw new AppError(403, '账号已被禁用');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new AppError(401, '手机号或密码错误');
    }

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.role);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: string; role: string };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || !user.isActive) {
        throw new AppError(401, '无效的刷新令牌');
      }

      const tokens = this.generateTokens(user.id, user.role);

      return {
        user: this.sanitizeUser(user),
        ...tokens,
      };
    } catch (error) {
      throw new AppError(401, '无效的刷新令牌');
    }
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        elderlyProfile: true,
        familyRelations: {
          include: {
            elderlyProfile: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError(404, '用户不存在');
    }

    return this.sanitizeUser(user);
  }

  private generateTokens(userId: string, role: string) {
    const accessToken = jwt.sign(
      { userId, role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId, role },
      JWT_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}

export const authService = new AuthService();
