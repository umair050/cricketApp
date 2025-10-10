import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Player } from '../../players/entities/player.entity';
import { Tournament } from '../../tournaments/entities/tournament.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  matchesPlayed: number;

  @Column({ default: 0 })
  matchesWon: number;

  @Column({ default: 0 })
  matchesLost: number;

  @Column({ default: 0 })
  matchesDrawn: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  captain: User;

  @ManyToMany(() => Player, player => player.teams)
  @JoinTable({
    name: 'team_players',
    joinColumn: { name: 'teamId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'playerId', referencedColumnName: 'id' }
  })
  players: Player[];

  @ManyToMany(() => Tournament, tournament => tournament.teams)
  tournaments: Tournament[];
}