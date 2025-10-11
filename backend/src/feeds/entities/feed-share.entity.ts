import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { FeedPost } from './feed-post.entity';

@Entity('feed_shares')
@Unique(['post', 'user'])
export class FeedShare {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => FeedPost, post => post.shares, { onDelete: 'CASCADE' })
  post: FeedPost;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ type: 'text', nullable: true })
  shareText: string;

  @CreateDateColumn()
  createdAt: Date;
}

