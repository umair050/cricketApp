import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, IsObject, IsArray, Min, Max } from 'class-validator';
import { PitchType } from '../entities/ground.entity';

export class CreateGroundDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsEnum(PitchType)
  pitchType: PitchType;

  @IsNumber()
  @Min(0)
  hourlyRate: number;

  @IsNumber()
  @Min(0)
  dailyRate: number;

  @IsString()
  @IsNotEmpty()
  openTime: string; // Format: 'HH:MM:SS'

  @IsString()
  @IsNotEmpty()
  closeTime: string; // Format: 'HH:MM:SS'

  @IsObject()
  @IsOptional()
  amenities?: {
    lighting: boolean;
    dressingRoom: boolean;
    parking: boolean;
    waterSupply: boolean;
    firstAid: boolean;
    cafeteria: boolean;
    scoreboard: boolean;
    seatingCapacity: number;
  };

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  capacity?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  size?: number;
}

