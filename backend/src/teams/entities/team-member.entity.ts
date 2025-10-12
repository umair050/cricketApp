import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Player } from '../../players/entities/player.entity';
import { Team } from './team.entity';

export enum TeamMemberRole {
  CAPTAIN = 'CAPTAIN',
  VICE_CAPTAIN = 'VICE_CAPTAIN',
  MEMBER = 'MEMBER',
}

@Entity('team_members')
@Unique(['team', 'player']) // Prevent duplicate team-player combinations
export class TeamMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TeamMemberRole,
    default: TeamMemberRole.MEMBER,
  })
  role: TeamMemberRole;

  @CreateDateColumn()
  joinedAt: Date;

  // Relations
  @ManyToOne(() => Team, team => team.members, { onDelete: 'CASCADE' })
  team: Team;

  @ManyToOne(() => Player, { eager: true, onDelete: 'CASCADE' })
  player: Player;
}
