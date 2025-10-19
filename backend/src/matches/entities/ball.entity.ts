import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Match } from './match.entity';
import { Player } from '../../players/entities/player.entity';
import { Team } from '../../teams/entities/team.entity';

export enum BallOutcome {
  DOT = 'dot',
  SINGLE = 'single',
  DOUBLE = 'double',
  TRIPLE = 'triple',
  FOUR = 'four',
  SIX = 'six',
  WIDE = 'wide',
  NO_BALL = 'no_ball',
  BYE = 'bye',
  LEG_BYE = 'leg_bye',
  WICKET = 'wicket',
}

export enum WicketType {
  BOWLED = 'bowled',
  CAUGHT = 'caught',
  LBW = 'lbw',
  RUN_OUT = 'run_out',
  STUMPED = 'stumped',
  HIT_WICKET = 'hit_wicket',
  CAUGHT_AND_BOWLED = 'caught_and_bowled',
  RETIRED_HURT = 'retired_hurt',
}

@Entity('balls')
export class Ball {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Match, { onDelete: 'CASCADE' })
  match: Match;

  @ManyToOne(() => Team)
  battingTeam: Team;

  @ManyToOne(() => Team)
  bowlingTeam: Team;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  overNumber: number; // e.g., 5.3 (5th over, 3rd ball)

  @Column()
  ballNumber: number; // Sequential ball number in match

  @ManyToOne(() => Player, { eager: true })
  batsman: Player;

  @ManyToOne(() => Player, { nullable: true, eager: true })
  nonStriker: Player;

  @ManyToOne(() => Player, { eager: true })
  bowler: Player;

  @Column({
    type: 'enum',
    enum: BallOutcome,
  })
  outcome: BallOutcome;

  @Column({ default: 0 })
  runs: number; // Runs scored off this ball

  @Column({ default: 0 })
  extras: number; // Extra runs (wides, no-balls, byes)

  @Column({ default: false })
  isWicket: boolean;

  @Column({
    type: 'enum',
    enum: WicketType,
    nullable: true,
  })
  wicketType: WicketType;

  @ManyToOne(() => Player, { nullable: true, eager: true })
  fielder: Player; // Who took the catch/ran out

  @Column({ type: 'text', nullable: true })
  commentary: string;

  @Column({ default: false })
  isBoundary: boolean; // 4 or 6

  @Column({ default: false })
  isLegal: boolean; // false for wide/no-ball

  @CreateDateColumn()
  createdAt: Date;
}



