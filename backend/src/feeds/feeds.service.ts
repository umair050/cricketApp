import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { FeedPost } from './entities/feed-post.entity';
import { FeedLike } from './entities/feed-like.entity';
import { FeedComment } from './entities/feed-comment.entity';
import { FeedShare } from './entities/feed-share.entity';
import { User } from '../users/entities/user.entity';
import { Team } from '../teams/entities/team.entity';
import { Tournament } from '../tournaments/entities/tournament.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FeedQueryDto, FeedType, SortBy } from './dto/feed-query.dto';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(FeedPost)
    private feedPostRepository: Repository<FeedPost>,
    @InjectRepository(FeedLike)
    private feedLikeRepository: Repository<FeedLike>,
    @InjectRepository(FeedComment)
    private feedCommentRepository: Repository<FeedComment>,
    @InjectRepository(FeedShare)
    private feedShareRepository: Repository<FeedShare>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,
  ) {}

  // Create a new post
  async createPost(userId: number, createPostDto: CreatePostDto): Promise<FeedPost> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = this.feedPostRepository.create({
      user,
      content: createPostDto.content,
      mediaType: createPostDto.mediaType,
      mediaUrls: createPostDto.mediaUrls,
      location: createPostDto.location,
      hashtags: createPostDto.hashtags,
      privacy: createPostDto.privacy,
    });

    // Handle tagged users
    if (createPostDto.taggedUserIds && createPostDto.taggedUserIds.length > 0) {
      const taggedUsers = await this.userRepository.find({
        where: { id: In(createPostDto.taggedUserIds) }
      });
      post.taggedUsers = taggedUsers;
    }

    // Handle tagged team
    if (createPostDto.taggedTeamId) {
      const team = await this.teamRepository.findOne({
        where: { id: createPostDto.taggedTeamId }
      });
      if (team) {
        post.taggedTeam = team;
      }
    }

    // Handle tagged tournament
    if (createPostDto.taggedTournamentId) {
      const tournament = await this.tournamentRepository.findOne({
        where: { id: createPostDto.taggedTournamentId }
      });
      if (tournament) {
        post.taggedTournament = tournament;
      }
    }

    return this.feedPostRepository.save(post);
  }

  // Get posts with filtering and pagination
  async getPosts(query: FeedQueryDto, currentUserId?: number): Promise<{ posts: FeedPost[], total: number, page: number, limit: number }> {
    const { page = 1, limit = 10, sortBy = SortBy.NEWEST, feedType, mediaType, hashtag, location, userId, teamId, tournamentId } = query;
    
    const queryBuilder = this.feedPostRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.taggedUsers', 'taggedUsers')
      .leftJoinAndSelect('post.taggedTeam', 'taggedTeam')
      .leftJoinAndSelect('post.taggedTournament', 'taggedTournament')
      .where('post.isActive = :isActive', { isActive: true });

    // Apply feed type filters
    if (feedType === FeedType.PERSONAL && currentUserId) {
      queryBuilder.andWhere('user.id = :currentUserId', { currentUserId });
    } else if (feedType === FeedType.USER && userId) {
      queryBuilder.andWhere('user.id = :userId', { userId });
    } else if (feedType === FeedType.TEAM && teamId) {
      queryBuilder.andWhere('post.taggedTeamId = :teamId', { teamId });
    } else if (feedType === FeedType.TOURNAMENT && tournamentId) {
      queryBuilder.andWhere('post.taggedTournamentId = :tournamentId', { tournamentId });
    }

    // Apply media type filter
    if (mediaType) {
      queryBuilder.andWhere('post.mediaType = :mediaType', { mediaType });
    }

    // Apply hashtag filter
    if (hashtag) {
      queryBuilder.andWhere(':hashtag = ANY(post.hashtags)', { hashtag });
    }

    // Apply location filter
    if (location) {
      queryBuilder.andWhere('post.location ILIKE :location', { location: `%${location}%` });
    }

    // Apply privacy filter (show public posts or user's own posts)
    if (currentUserId) {
      queryBuilder.andWhere(
        '(post.privacy = :public OR user.id = :currentUserId)',
        { public: 'public', currentUserId }
      );
    } else {
      queryBuilder.andWhere('post.privacy = :public', { public: 'public' });
    }

    // Apply sorting
    switch (sortBy) {
      case SortBy.MOST_LIKED:
        queryBuilder.orderBy('post.likeCount', 'DESC');
        break;
      case SortBy.MOST_COMMENTED:
        queryBuilder.orderBy('post.commentCount', 'DESC');
        break;
      case SortBy.NEWEST:
      default:
        queryBuilder.orderBy('post.createdAt', 'DESC');
        break;
    }

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [posts, total] = await queryBuilder.getManyAndCount();

    // Enrich posts with user's like status if currentUserId is provided
    if (currentUserId) {
      for (const post of posts) {
        const like = await this.feedLikeRepository.findOne({
          where: { post: { id: post.id }, user: { id: currentUserId } }
        });
        (post as any).isLikedByCurrentUser = !!like;
      }
    }

    return { posts, total, page, limit };
  }

  // Get a single post by ID
  async getPostById(postId: number, currentUserId?: number): Promise<FeedPost> {
    const post = await this.feedPostRepository.findOne({
      where: { id: postId, isActive: true },
      relations: ['user', 'taggedUsers', 'taggedTeam', 'taggedTournament'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Increment view count
    post.viewCount += 1;
    await this.feedPostRepository.save(post);

    // Check if current user liked the post
    if (currentUserId) {
      const like = await this.feedLikeRepository.findOne({
        where: { post: { id: post.id }, user: { id: currentUserId } }
      });
      (post as any).isLikedByCurrentUser = !!like;
    }

    return post;
  }

  // Update a post
  async updatePost(postId: number, userId: number, updatePostDto: UpdatePostDto): Promise<FeedPost> {
    const post = await this.feedPostRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.user.id !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    // Update basic fields
    Object.assign(post, {
      content: updatePostDto.content ?? post.content,
      mediaType: updatePostDto.mediaType ?? post.mediaType,
      mediaUrls: updatePostDto.mediaUrls ?? post.mediaUrls,
      location: updatePostDto.location ?? post.location,
      hashtags: updatePostDto.hashtags ?? post.hashtags,
      privacy: updatePostDto.privacy ?? post.privacy,
    });

    // Update tagged users if provided
    if (updatePostDto.taggedUserIds) {
      const taggedUsers = await this.userRepository.find({
        where: { id: In(updatePostDto.taggedUserIds) }
      });
      post.taggedUsers = taggedUsers;
    }

    // Update tagged team if provided
    if (updatePostDto.taggedTeamId !== undefined) {
      if (updatePostDto.taggedTeamId === null) {
        post.taggedTeam = null;
      } else {
        const team = await this.teamRepository.findOne({
          where: { id: updatePostDto.taggedTeamId }
        });
        if (team) {
          post.taggedTeam = team;
        }
      }
    }

    // Update tagged tournament if provided
    if (updatePostDto.taggedTournamentId !== undefined) {
      if (updatePostDto.taggedTournamentId === null) {
        post.taggedTournament = null;
      } else {
        const tournament = await this.tournamentRepository.findOne({
          where: { id: updatePostDto.taggedTournamentId }
        });
        if (tournament) {
          post.taggedTournament = tournament;
        }
      }
    }

    return this.feedPostRepository.save(post);
  }

  // Delete a post
  async deletePost(postId: number, userId: number): Promise<void> {
    const post = await this.feedPostRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    // Soft delete by setting isActive to false
    post.isActive = false;
    await this.feedPostRepository.save(post);
  }

  // Like/Unlike a post
  async toggleLike(postId: number, userId: number): Promise<{ liked: boolean, likeCount: number }> {
    const post = await this.feedPostRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingLike = await this.feedLikeRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } }
    });

    if (existingLike) {
      // Unlike
      await this.feedLikeRepository.remove(existingLike);
      post.likeCount = Math.max(0, post.likeCount - 1);
      await this.feedPostRepository.save(post);
      return { liked: false, likeCount: post.likeCount };
    } else {
      // Like
      const like = this.feedLikeRepository.create({ post, user });
      await this.feedLikeRepository.save(like);
      post.likeCount += 1;
      await this.feedPostRepository.save(post);
      return { liked: true, likeCount: post.likeCount };
    }
  }

  // Get likes for a post
  async getPostLikes(postId: number): Promise<FeedLike[]> {
    return this.feedLikeRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  // Add a comment to a post
  async addComment(postId: number, userId: number, createCommentDto: CreateCommentDto): Promise<FeedComment> {
    const post = await this.feedPostRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const comment = this.feedCommentRepository.create({
      post,
      user,
      commentText: createCommentDto.commentText,
    });

    const savedComment = await this.feedCommentRepository.save(comment);

    // Update comment count
    post.commentCount += 1;
    await this.feedPostRepository.save(post);

    return savedComment;
  }

  // Get comments for a post (only top-level comments)
  async getPostComments(postId: number, page: number = 1, limit: number = 20): Promise<{ comments: FeedComment[], total: number }> {
    const skip = (page - 1) * limit;
    
    const [comments, total] = await this.feedCommentRepository.findAndCount({
      where: { post: { id: postId }, isActive: true, parentComment: IsNull() },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return { comments, total };
  }

  // Delete a comment
  async deleteComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.feedCommentRepository.findOne({
      where: { id: commentId },
      relations: ['user', 'post'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    // Soft delete
    comment.isActive = false;
    await this.feedCommentRepository.save(comment);

    // Update comment count
    const post = await this.feedPostRepository.findOne({ where: { id: comment.post.id } });
    if (post) {
      post.commentCount = Math.max(0, post.commentCount - 1);
      await this.feedPostRepository.save(post);
    }
  }

  // Get trending hashtags
  async getTrendingHashtags(limit: number = 10): Promise<{ hashtag: string, count: number }[]> {
    const posts = await this.feedPostRepository.find({
      where: { isActive: true },
      select: ['hashtags'],
    });

    const hashtagCounts = new Map<string, number>();
    
    posts.forEach(post => {
      if (post.hashtags && post.hashtags.length > 0) {
        post.hashtags.forEach(tag => {
          const count = hashtagCounts.get(tag) || 0;
          hashtagCounts.set(tag, count + 1);
        });
      }
    });

    return Array.from(hashtagCounts.entries())
      .map(([hashtag, count]) => ({ hashtag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // Add a reply to a comment
  async addReply(commentId: number, userId: number, createCommentDto: CreateCommentDto): Promise<FeedComment> {
    const parentComment = await this.feedCommentRepository.findOne({
      where: { id: commentId },
      relations: ['post'],
    });

    if (!parentComment) {
      throw new NotFoundException('Comment not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const reply = this.feedCommentRepository.create({
      post: parentComment.post,
      user,
      commentText: createCommentDto.commentText,
      parentComment,
    });

    const savedReply = await this.feedCommentRepository.save(reply);

    // Update reply count on parent comment
    parentComment.replyCount += 1;
    await this.feedCommentRepository.save(parentComment);

    return savedReply;
  }

  // Get replies for a comment
  async getCommentReplies(commentId: number, page: number = 1, limit: number = 10): Promise<{ replies: FeedComment[], total: number }> {
    const skip = (page - 1) * limit;

    const [replies, total] = await this.feedCommentRepository.findAndCount({
      where: { parentComment: { id: commentId }, isActive: true },
      relations: ['user'],
      order: { createdAt: 'ASC' },
      skip,
      take: limit,
    });

    return { replies, total };
  }

  // Share a post
  async sharePost(postId: number, userId: number, shareText?: string): Promise<FeedShare> {
    const post = await this.feedPostRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if already shared
    const existingShare = await this.feedShareRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } }
    });

    if (existingShare) {
      throw new BadRequestException('You have already shared this post');
    }

    const share = this.feedShareRepository.create({
      post,
      user,
      shareText,
    });

    const savedShare = await this.feedShareRepository.save(share);

    // Update share count
    post.shareCount += 1;
    await this.feedPostRepository.save(post);

    return savedShare;
  }

  // Get shares for a post
  async getPostShares(postId: number): Promise<FeedShare[]> {
    return this.feedShareRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  // Unshare a post
  async unsharePost(postId: number, userId: number): Promise<void> {
    const share = await this.feedShareRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
      relations: ['post'],
    });

    if (!share) {
      throw new NotFoundException('Share not found');
    }

    await this.feedShareRepository.remove(share);

    // Update share count
    const post = await this.feedPostRepository.findOne({ where: { id: postId } });
    if (post) {
      post.shareCount = Math.max(0, post.shareCount - 1);
      await this.feedPostRepository.save(post);
    }
  }
}

