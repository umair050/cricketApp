import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Team } from '../../teams/entities/team.entity';
import { Tournament } from '../../tournaments/entities/tournament.entity';
import { FeedLike } from './feed-like.entity';
import { FeedComment } from './feed-comment.entity';
import { FeedShare } from './feed-share.entity';

export enum MediaType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  MIXED = 'mixed',
}

export enum PostPrivacy {
  PUBLIC = 'public',
  FRIENDS = 'friends',
  PRIVATE = 'private',
}

@Entity('feed_posts')
export class FeedPost {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({
    type: 'enum',
    enum: MediaType,
    default: MediaType.TEXT,
  })
  mediaType: MediaType;

  @Column({ type: 'simple-array', nullable: true })
  mediaUrls: string[];

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'simple-array', nullable: true })
  hashtags: string[];

  @Column({
    type: 'enum',
    enum: PostPrivacy,
    default: PostPrivacy.PUBLIC,
  })
  privacy: PostPrivacy;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: 0 })
  commentCount: number;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  shareCount: number;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'feed_post_tagged_users',
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' }
  })
  taggedUsers: User[];

  @ManyToOne(() => Team, { nullable: true })
  taggedTeam: Team;

  @ManyToOne(() => Tournament, { nullable: true })
  taggedTournament: Tournament;

  @OneToMany(() => FeedLike, like => like.post)
  likes: FeedLike[];

  @OneToMany(() => FeedComment, comment => comment.post)
  comments: FeedComment[];

  @OneToMany(() => FeedShare, share => share.post)
  shares: FeedShare[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

