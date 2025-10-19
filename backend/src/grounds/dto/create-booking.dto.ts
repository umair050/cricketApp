import { IsString, IsNotEmpty, IsEnum, IsDateString, IsNumber, IsOptional, Min } from 'class-validator';
import { SlotType } from '../entities/booking.entity';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  groundId: string;

  @IsEnum(SlotType)
  slotType: SlotType;

  @IsDateString()
  startDatetime: string;

  @IsDateString()
  endDatetime: string;

  @IsString()
  @IsOptional()
  purpose?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @Min(0)
  totalAmount: number;
}

