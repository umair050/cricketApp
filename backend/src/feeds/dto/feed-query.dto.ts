import { IsOptional, IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { MediaType, PostPrivacy } from '../entities/feed-post.entity';

export enum FeedType {
  GLOBAL = 'global',
  PERSONAL = 'personal',
  FRIENDS = 'friends',
  TEAM = 'team',
  TOURNAMENT = 'tournament',
  USER = 'user',
}

export enum SortBy {
  NEWEST = 'newest',
  MOST_LIKED = 'most_liked',
  MOST_COMMENTED = 'most_commented',
}

export class FeedQueryDto {
  @IsOptional()
  @IsEnum(FeedType)
  feedType?: FeedType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.NEWEST;

  @IsOptional()
  @IsEnum(MediaType)
  mediaType?: MediaType;

  @IsOptional()
  @IsString()
  hashtag?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  userId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  teamId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  tournamentId?: number;
}

