import { IsEmail, IsString, MinLength, IsOptional, IsEnum, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, Country } from '@afribayit/db';

export class RegisterDto {
  @ApiProperty({ example: 'aminata@example.com' })
  @IsEmail({}, { message: 'Email invalide' })
  email!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8, { message: '8 caractères minimum' })
  @Matches(/[A-Z]/, { message: 'Au moins une majuscule requise' })
  @Matches(/[0-9]/, { message: 'Au moins un chiffre requis' })
  password!: string;

  @ApiProperty({ example: 'Aminata' })
  @IsString()
  @MinLength(2)
  firstName!: string;

  @ApiProperty({ example: 'Koné' })
  @IsString()
  @MinLength(2)
  lastName!: string;

  @ApiPropertyOptional({ example: '+22997000000' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.BUYER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ enum: Country, default: Country.BJ })
  @IsOptional()
  @IsEnum(Country)
  country?: Country;
}
