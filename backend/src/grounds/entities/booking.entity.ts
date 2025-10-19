import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Ground } from './ground.entity';
import { Payment } from './payment.entity';
import { GroundSlot } from './ground-slot.entity';

export enum SlotType {
  HOURLY = 'hourly',
  DAILY = 'daily',
  MULTI_DAY = 'multi_day',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Ground, ground => ground.bookings, { eager: true })
  ground: Ground;

  @Column({
    type: 'enum',
    enum: SlotType,
    default: SlotType.HOURLY,
  })
  slotType: SlotType;

  @Column({ type: 'timestamp' })
  startDatetime: Date;

  @Column({ type: 'timestamp' })
  endDatetime: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  platformFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ type: 'text', nullable: true })
  purpose: string; // match, practice, tournament

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ type: 'timestamp', nullable: true })
  confirmedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @OneToOne(() => Payment, payment => payment.booking)
  payment: Payment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

