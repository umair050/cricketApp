import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Team } from '../../teams/entities/team.entity';

export enum PlayerRole {
  BATSMAN = 'batsman',
  BOWLER = 'bowler',
  ALL_ROUNDER = 'all_rounder',
  WICKET_KEEPER = 'wicket_keeper',
}

export enum BattingStyle {
  RIGHT_HANDED = 'right_handed',
  LEFT_HANDED = 'left_handed',
}

export enum BowlingStyle {
  RIGHT_ARM_FAST = 'right_arm_fast',
  LEFT_ARM_FAST = 'left_arm_fast',
  RIGHT_ARM_MEDIUM = 'right_arm_medium',
  LEFT_ARM_MEDIUM = 'left_arm_medium',
  RIGHT_ARM_SPIN = 'right_arm_spin',
  LEFT_ARM_SPIN = 'left_arm_spin',
  WICKET_KEEPER = 'wicket_keeper',
}

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: PlayerRole,
  })
  role: PlayerRole;

  @Column({
    type: 'enum',
    enum: BattingStyle,
    nullable: true,
  })
  battingStyle: BattingStyle;

  @Column({
    type: 'enum',
    enum: BowlingStyle,
    nullable: true,
  })
  bowlingStyle: BowlingStyle;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  profilePicture: string;

  // Statistics
  @Column({ default: 0 })
  matchesPlayed: number;

  @Column({ default: 0 })
  runsScored: number;

  @Column({ default: 0 })
  wicketsTaken: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  battingAverage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  bowlingAverage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  strikeRate: number;

  @Column({ default: false })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, user => user.player)
  @JoinColumn()
  user: User;

  @ManyToMany(() => Team, team => team.players)
  teams: Team[];
}