import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CheckAvailabilityDto {
  @IsString()
  @IsNotEmpty()
  groundId: string;

  @IsDateString()
  date: string; // YYYY-MM-DD format

  @IsString()
  @IsNotEmpty()
  startTime: string; // HH:MM:SS format

  @IsString()
  @IsNotEmpty()
  endTime: string; // HH:MM:SS format
}

