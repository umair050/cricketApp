import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { FeedPost } from './feed-post.entity';

@Entity('feed_likes')
@Unique(['post', 'user'])
export class FeedLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => FeedPost, post => post.likes, { onDelete: 'CASCADE' })
  post: FeedPost;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}

