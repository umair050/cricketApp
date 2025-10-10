import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  PLAYER = 'player',
  ADMIN = 'admin',
  ORGANIZER = 'organizer',
}

export class RegisterDto {
  @ApiProperty({ 
    description: 'User full name',
    example: 'John Cricket' 
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ 
    description: 'User email address',
    example: 'john@cricket.com' 
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    description: 'User password (minimum 6 characters)',
    example: 'password123' 
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    description: 'User phone number',
    example: '+1234567890',
    required: false 
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ 
    description: 'User role',
    enum: UserRole,
    default: UserRole.PLAYER 
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.PLAYER;
}