import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Match } from './match.entity';
import { Player } from '../../players/entities/player.entity';
import { Team } from '../../teams/entities/team.entity';

@Entity('scorecards')
export class Scorecard {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Match, { onDelete: 'CASCADE' })
  match: Match;

  @ManyToOne(() => Player, { eager: true })
  player: Player;

  @ManyToOne(() => Team)
  team: Team;

  // Batting stats
  @Column({ default: 0 })
  runs: number;

  @Column({ default: 0 })
  balls: number;

  @Column({ default: 0 })
  fours: number;

  @Column({ default: 0 })
  sixes: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  strikeRate: number;

  @Column({ default: false })
  isOut: boolean;

  @Column({ nullable: true })
  dismissalType: string; // bowled, caught, lbw, etc.

  // Bowling stats
  @Column({ type: 'decimal', precision: 4, scale: 1, default: 0 })
  oversBowled: number;

  @Column({ default: 0 })
  wickets: number;

  @Column({ default: 0 })
  runsConceded: number;

  @Column({ default: 0 })
  maidens: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  economy: number;

  // Fielding stats
  @Column({ default: 0 })
  catches: number;

  @Column({ default: 0 })
  runOuts: number;

  @Column({ default: 0 })
  stumpings: number;

  @Column({ default: false })
  isPlayerOfMatch: boolean;

  @CreateDateColumn()
  createdAt: Date;
}


