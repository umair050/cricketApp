import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedsService } from './feeds.service';
import { FeedsController } from './feeds.controller';
import { FeedPost } from './entities/feed-post.entity';
import { FeedLike } from './entities/feed-like.entity';
import { FeedComment } from './entities/feed-comment.entity';
import { FeedShare } from './entities/feed-share.entity';
import { User } from '../users/entities/user.entity';
import { Team } from '../teams/entities/team.entity';
import { Tournament } from '../tournaments/entities/tournament.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FeedPost,
      FeedLike,
      FeedComment,
      FeedShare,
      User,
      Team,
      Tournament,
    ]),
  ],
  controllers: [FeedsController],
  providers: [FeedsService],
  exports: [FeedsService],
})
export class FeedsModule {}

