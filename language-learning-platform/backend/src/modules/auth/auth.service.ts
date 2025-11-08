import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../db/entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async sendMagicLink(email: string) {
    // Generate magic link token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresIn = this.configService.get<string>('magicLink.expiresIn');
    
    // TODO: Store token in Redis with expiration
    // TODO: Send email with magic link
    
    // For now, just log (in production, send email)
    console.log(`Magic link for ${email}: ${token}`);
    
    return { token, expiresIn };
  }

  async verifyMagicLink(token: string) {
    // TODO: Verify token from Redis
    // For now, create or get user
    const email = 'test@example.com'; // In production, extract from token
    
    let user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      user = this.userRepository.create({
        email,
        role: 'user',
      });
      await this.userRepository.save(user);
    }

    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    const jwtToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
