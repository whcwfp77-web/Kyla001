import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('magic-link')
  @ApiOperation({ summary: 'Request magic link for authentication' })
  async requestMagicLink(@Body('email') email: string) {
    await this.authService.sendMagicLink(email);
    return { message: 'Magic link sent to email' };
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify magic link token' })
  async verifyMagicLink(@Body('token') token: string) {
    const result = await this.authService.verifyMagicLink(token);
    return result;
  }
}
