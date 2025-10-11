import { IsString, IsOptional, IsEnum, IsArray, IsNumber, MaxLength } from 'class-validator';
import { MediaType, PostPrivacy } from '../entities/feed-post.entity';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  content?: string;

  @IsOptional()
  @IsEnum(MediaType)
  mediaType?: MediaType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mediaUrls?: string[];

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashtags?: string[];

  @IsOptional()
  @IsEnum(PostPrivacy)
  privacy?: PostPrivacy;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  taggedUserIds?: number[];

  @IsOptional()
  @IsNumber()
  taggedTeamId?: number;

  @IsOptional()
  @IsNumber()
  taggedTournamentId?: number;
}

