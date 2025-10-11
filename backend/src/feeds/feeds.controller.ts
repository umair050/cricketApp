import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FeedsService } from './feeds.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FeedQueryDto } from './dto/feed-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Feeds')
@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createPost(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    return this.feedsService.createPost(req.user.id, createPostDto);
  }

  @ApiOperation({ summary: 'Get feed posts with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  @Get()
  getPosts(@Query() query: FeedQueryDto, @Request() req: any) {
    // Optional authentication - check if user is logged in
    const userId = req.user?.id;
    return this.feedsService.getPosts(query, userId);
  }

  @ApiOperation({ summary: 'Get a single post by ID' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @Get(':id')
  getPostById(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id;
    return this.feedsService.getPostById(+id, userId);
  }

  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your post' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: any,
  ) {
    return this.feedsService.updatePost(+id, req.user.id, updatePostDto);
  }

  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 204, description: 'Post deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your post' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePost(@Param('id') id: string, @Request() req: any) {
    return this.feedsService.deletePost(+id, req.user.id);
  }

  @ApiOperation({ summary: 'Like or unlike a post' })
  @ApiResponse({ status: 200, description: 'Like toggled successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  toggleLike(@Param('id') id: string, @Request() req: any) {
    return this.feedsService.toggleLike(+id, req.user.id);
  }

  @ApiOperation({ summary: 'Get likes for a post' })
  @ApiResponse({ status: 200, description: 'Likes retrieved successfully' })
  @Get(':id/likes')
  getPostLikes(@Param('id') id: string) {
    return this.feedsService.getPostLikes(+id);
  }

  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiResponse({ status: 201, description: 'Comment added successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: any,
  ) {
    return this.feedsService.addComment(+id, req.user.id, createCommentDto);
  }

  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  @Get(':id/comments')
  getPostComments(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.feedsService.getPostComments(
      +id,
      page ? +page : 1,
      limit ? +limit : 20,
    );
  }

  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 204, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your comment' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteComment(@Param('commentId') commentId: string, @Request() req: any) {
    return this.feedsService.deleteComment(+commentId, req.user.id);
  }

  @ApiOperation({ summary: 'Get trending hashtags' })
  @ApiResponse({ status: 200, description: 'Trending hashtags retrieved successfully' })
  @Get('trending/hashtags')
  getTrendingHashtags(@Query('limit') limit?: string) {
    return this.feedsService.getTrendingHashtags(limit ? +limit : 10);
  }

  @ApiOperation({ summary: 'Add a reply to a comment' })
  @ApiResponse({ status: 201, description: 'Reply added successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('comments/:commentId/replies')
  @HttpCode(HttpStatus.CREATED)
  addReply(
    @Param('commentId') commentId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: any,
  ) {
    return this.feedsService.addReply(+commentId, req.user.id, createCommentDto);
  }

  @ApiOperation({ summary: 'Get replies for a comment' })
  @ApiResponse({ status: 200, description: 'Replies retrieved successfully' })
  @Get('comments/:commentId/replies')
  getCommentReplies(
    @Param('commentId') commentId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.feedsService.getCommentReplies(
      +commentId,
      page ? +page : 1,
      limit ? +limit : 10,
    );
  }

  @ApiOperation({ summary: 'Share a post' })
  @ApiResponse({ status: 201, description: 'Post shared successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/share')
  @HttpCode(HttpStatus.CREATED)
  sharePost(
    @Param('id') id: string,
    @Body('shareText') shareText: string,
    @Request() req: any,
  ) {
    return this.feedsService.sharePost(+id, req.user.id, shareText);
  }

  @ApiOperation({ summary: 'Get shares for a post' })
  @ApiResponse({ status: 200, description: 'Shares retrieved successfully' })
  @Get(':id/shares')
  getPostShares(@Param('id') id: string) {
    return this.feedsService.getPostShares(+id);
  }

  @ApiOperation({ summary: 'Unshare a post' })
  @ApiResponse({ status: 204, description: 'Post unshared successfully' })
  @ApiResponse({ status: 404, description: 'Share not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id/share')
  @HttpCode(HttpStatus.NO_CONTENT)
  unsharePost(@Param('id') id: string, @Request() req: any) {
    return this.feedsService.unsharePost(+id, req.user.id);
  }
}

