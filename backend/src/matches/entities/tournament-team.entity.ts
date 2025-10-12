import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Unique } from 'typeorm';
import { Tournament } from '../../tournaments/entities/tournament.entity';
import { Team } from '../../teams/entities/team.entity';
import { TournamentGroup } from './group.entity';

@Entity('match_tournament_teams')
@Unique(['tournament', 'team'])
export class TournamentTeam {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tournament, { onDelete: 'CASCADE' })
  tournament: Tournament;

  @ManyToOne(() => Team, { eager: true })
  team: Team;

  @ManyToOne(() => TournamentGroup, { nullable: true })
  group: TournamentGroup;

  @Column({ default: 0 })
  points: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  netRunRate: number;

  @Column({ default: 0 })
  matchesPlayed: number;

  @Column({ default: 0 })
  wins: number;

  @Column({ default: 0 })
  losses: number;

  @Column({ default: 0 })
  draws: number;

  @Column({ default: 0 })
  noResults: number;

  @Column({ default: 0 })
  runsScored: number;

  @Column({ default: 0 })
  runsConceded: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  oversFaced: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  oversBowled: number;

  @Column({ default: false })
  isQualified: boolean; // Advanced to knockout

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

