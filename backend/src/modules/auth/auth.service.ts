import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../db/entities';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private magicLinkTokens = new Map<string, { email: string; expiresAt: number }>();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // 每5分钟清理过期的魔法链接token
    setInterval(() => this.cleanupExpiredTokens(), 5 * 60 * 1000);
  }

  async sendMagicLink(email: string, redirectUrl?: string): Promise<{ message: string; expiresIn: number }> {
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    // 生成随机token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresIn = 15 * 60; // 15分钟
    const expiresAt = Date.now() + expiresIn * 1000;

    // 存储token（生产环境应使用Redis）
    this.magicLinkTokens.set(token, { email, expiresAt });

    // 构建魔法链接
    const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    const magicLink = `${frontendUrl}/auth/verify?token=${token}&redirect=${encodeURIComponent(redirectUrl || '/')}`;

    // TODO: 发送邮件（集成Nodemailer）
    console.log(`🔗 Magic Link for ${email}:\n${magicLink}`);

    return {
      message: '魔法链接已发送到您的邮箱',
      expiresIn,
    };
  }

  async verifyMagicLink(token: string): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    // 检查token是否存在
    const tokenData = this.magicLinkTokens.get(token);
    if (!tokenData) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // 检查是否过期
    if (Date.now() > tokenData.expiresAt) {
      this.magicLinkTokens.delete(token);
      throw new UnauthorizedException('Token has expired');
    }

    // 删除已使用的token
    this.magicLinkTokens.delete(token);

    // 查找或创建用户
    let user = await this.userRepository.findOne({ where: { email: tokenData.email } });
    
    if (!user) {
      user = this.userRepository.create({
        email: tokenData.email,
        role: 'user',
        isActive: true,
      });
      await this.userRepository.save(user);
    }

    // 更新最后登录时间
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    // 生成JWT token
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      const accessToken = this.generateAccessToken(user);
      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }
    return user;
  }

  private generateAccessToken(user: User): string {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(user: User): string {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });
  }

  private cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [token, data] of this.magicLinkTokens.entries()) {
      if (now > data.expiresAt) {
        this.magicLinkTokens.delete(token);
      }
    }
  }
}
