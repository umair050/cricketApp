import { IsEnum, IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';
import { MatchType, MatchStage } from '../entities/match.entity';

export class CreateMatchDto {
  @IsEnum(MatchType)
  matchType: MatchType;

  @IsOptional()
  @IsNumber()
  tournamentId?: number;

  @IsOptional()
  @IsString()
  groupName?: string;

  @IsOptional()
  @IsEnum(MatchStage)
  stage?: MatchStage;

  @IsNumber()
  teamAId: number;

  @IsNumber()
  teamBId: number;

  @IsDateString()
  matchDate: string;

  @IsOptional()
  @IsString()
  venue?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsNumber()
  overs?: number;
}

