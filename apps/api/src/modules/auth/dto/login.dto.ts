import { IsEmail, IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'aminata@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  password!: string;

  @ApiPropertyOptional({ description: 'TOTP code for 2FA', example: '123456' })
  @IsOptional()
  @IsString()
  @Length(6, 6)
  totpCode?: string;
}
