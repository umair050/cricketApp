import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Tournament } from '../../tournaments/entities/tournament.entity';

@Entity('tournament_groups')
export class TournamentGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tournament, { onDelete: 'CASCADE' })
  tournament: Tournament;

  @Column()
  name: string; // e.g., "Group A", "Group B"

  @Column({ default: 4 })
  maxTeams: number;

  @Column({ default: 2 })
  qualifyingTeams: number; // How many teams advance from this group

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}



