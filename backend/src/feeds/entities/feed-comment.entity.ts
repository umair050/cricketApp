import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { FeedPost } from './feed-post.entity';

@Entity('feed_comments')
export class FeedComment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => FeedPost, post => post.comments, { onDelete: 'CASCADE' })
  post: FeedPost;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ type: 'text' })
  commentText: string;

  @Column({ default: 0 })
  replyCount: number;

  // Self-referencing relation for replies
  @ManyToOne(() => FeedComment, comment => comment.replies, { nullable: true, onDelete: 'CASCADE' })
  parentComment: FeedComment;

  @OneToMany(() => FeedComment, comment => comment.parentComment)
  replies: FeedComment[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

