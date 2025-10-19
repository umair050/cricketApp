import { PartialType } from '@nestjs/mapped-types';
import { CreateGroundDto } from './create-ground.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { GroundStatus } from '../entities/ground.entity';

export class UpdateGroundDto extends PartialType(CreateGroundDto) {
  @IsEnum(GroundStatus)
  @IsOptional()
  status?: GroundStatus;
}

