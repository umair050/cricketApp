import { IsEnum, IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';
import { BallOutcome, WicketType } from '../entities/ball.entity';

export class AddBallDto {
  @IsNumber()
  matchId: number;

  @IsNumber()
  battingTeamId: number;

  @IsNumber()
  bowlingTeamId: number;

  @IsNumber()
  overNumber: number;

  @IsNumber()
  batsmanId: number;

  @IsOptional()
  @IsNumber()
  nonStrikerId?: number;

  @IsNumber()
  bowlerId: number;

  @IsEnum(BallOutcome)
  outcome: BallOutcome;

  @IsNumber()
  runs: number;

  @IsOptional()
  @IsNumber()
  extras?: number;

  @IsOptional()
  @IsBoolean()
  isWicket?: boolean;

  @IsOptional()
  @IsEnum(WicketType)
  wicketType?: WicketType;

  @IsOptional()
  @IsNumber()
  fielderId?: number;

  @IsOptional()
  @IsString()
  commentary?: string;
}



