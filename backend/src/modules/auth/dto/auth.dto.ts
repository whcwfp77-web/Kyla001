import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMagicLinkDto {
  @ApiProperty({ description: '用户邮箱', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '登录后重定向URL', required: false })
  @IsString()
  @IsOptional()
  redirectUrl?: string;
}

export class VerifyMagicLinkDto {
  @ApiProperty({ description: '魔法链接token' })
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: '刷新令牌' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
