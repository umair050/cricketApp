import { IsNumber, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateScorecardDto {
  @IsNumber()
  matchId: number;

  @IsNumber()
  playerId: number;

  @IsNumber()
  teamId: number;

  // Batting
  @IsOptional()
  @IsNumber()
  runs?: number;

  @IsOptional()
  @IsNumber()
  balls?: number;

  @IsOptional()
  @IsNumber()
  fours?: number;

  @IsOptional()
  @IsNumber()
  sixes?: number;

  @IsOptional()
  @IsBoolean()
  isOut?: boolean;

  @IsOptional()
  @IsString()
  dismissalType?: string;

  // Bowling
  @IsOptional()
  @IsNumber()
  oversBowled?: number;

  @IsOptional()
  @IsNumber()
  wickets?: number;

  @IsOptional()
  @IsNumber()
  runsConceded?: number;

  @IsOptional()
  @IsNumber()
  maidens?: number;

  // Fielding
  @IsOptional()
  @IsNumber()
  catches?: number;

  @IsOptional()
  @IsNumber()
  runOuts?: number;

  @IsOptional()
  @IsNumber()
  stumpings?: number;
}


