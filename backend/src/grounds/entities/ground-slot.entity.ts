import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Ground } from './ground.entity';
import { Booking } from './booking.entity';

@Entity('ground_slots')
export class GroundSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Ground, ground => ground.slots, { onDelete: 'CASCADE' })
  ground: Ground;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  startTime: string; // e.g., '10:00:00'

  @Column({ type: 'time' })
  endTime: string; // e.g., '12:00:00'

  @Column({ default: false })
  isBooked: boolean;

  @Column({ default: false })
  isBlocked: boolean; // Owner can block slots for maintenance

  @ManyToOne(() => Booking, { nullable: true })
  booking: Booking;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

