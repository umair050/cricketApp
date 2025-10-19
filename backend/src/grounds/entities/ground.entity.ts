import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { GroundSlot } from './ground-slot.entity';
import { Booking } from './booking.entity';

export enum GroundStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

export enum PitchType {
  TURF = 'turf',
  CEMENT = 'cement',
  MATTING = 'matting',
  ASTRO_TURF = 'astro_turf',
}

@Entity('grounds')
export class Ground {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  owner: User;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  longitude: number;

  @Column({
    type: 'enum',
    enum: PitchType,
    default: PitchType.TURF,
  })
  pitchType: PitchType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  hourlyRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  dailyRate: number;

  @Column({ type: 'time' })
  openTime: string; // e.g., '06:00:00'

  @Column({ type: 'time' })
  closeTime: string; // e.g., '22:00:00'

  @Column({ type: 'jsonb', nullable: true })
  amenities: {
    lighting: boolean;
    dressingRoom: boolean;
    parking: boolean;
    waterSupply: boolean;
    firstAid: boolean;
    cafeteria: boolean;
    scoreboard: boolean;
    seatingCapacity: number;
  };

  @Column({ type: 'jsonb', default: [] })
  images: string[];

  @Column({
    type: 'enum',
    enum: GroundStatus,
    default: GroundStatus.PENDING,
  })
  status: GroundStatus;

  @Column({ type: 'int', default: 0 })
  capacity: number; // max players/people

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  size: number; // in square meters

  @Column({ default: 0 })
  totalBookings: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => GroundSlot, slot => slot.ground)
  slots: GroundSlot[];

  @OneToMany(() => Booking, booking => booking.ground)
  bookings: Booking[];
}

