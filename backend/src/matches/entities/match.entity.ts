import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Tournament } from '../../tournaments/entities/tournament.entity';
import { Team } from '../../teams/entities/team.entity';
import { User } from '../../users/entities/user.entity';

export enum MatchType {
  FRIENDLY = 'friendly',
  TOURNAMENT = 'tournament',
}

export enum MatchStage {
  GROUP = 'group',
  QUARTER_FINAL = 'quarter_final',
  SEMI_FINAL = 'semi_final',
  FINAL = 'final',
}

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: MatchType,
    default: MatchType.FRIENDLY,
  })
  matchType: MatchType;

  @ManyToOne(() => Tournament, { nullable: true })
  tournament: Tournament;

  @Column({ nullable: true })
  groupName: string;

  @Column({
    type: 'enum',
    enum: MatchStage,
    nullable: true,
  })
  stage: MatchStage;

  @ManyToOne(() => Team, { eager: true })
  teamA: Team;

  @ManyToOne(() => Team, { eager: true })
  teamB: Team;

  @Column({ type: 'timestamp' })
  matchDate: Date;

  @Column({ nullable: true })
  venue: string;

  @Column({ nullable: true })
  city: string;

  @Column({ default: 20 })
  overs: number;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.SCHEDULED,
  })
  status: MatchStatus;

  @ManyToOne(() => Team, { nullable: true })
  winner: Team;

  @Column({ nullable: true })
  teamAScore: string; // e.g., "180/7"

  @Column({ nullable: true })
  teamBScore: string; // e.g., "178/9"

  @Column({ type: 'text', nullable: true })
  matchSummary: string;

  @ManyToOne(() => User, { nullable: true })
  manOfTheMatch: User;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

