import { IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { MatchStatus } from '../entities/match.entity';

export class UpdateMatchResultDto {
  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;

  @IsOptional()
  @IsNumber()
  winnerId?: number;

  @IsOptional()
  @IsString()
  teamAScore?: string;

  @IsOptional()
  @IsString()
  teamBScore?: string;

  @IsOptional()
  @IsString()
  matchSummary?: string;

  @IsOptional()
  @IsNumber()
  manOfTheMatchId?: number;
}



