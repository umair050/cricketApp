import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/middleware/auth';

const createPostSchema = z.object({
  caption: z.string().optional(),
  videoUrl: z.string().url('Invalid video URL'),
  thumbnailUrl: z.string().url().optional(),
  duration: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const authResult = await authMiddleware(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = await request.json();
    
    // Validate input
    const validation = createPostSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { caption, videoUrl, thumbnailUrl, duration } = validation.data;

    // Create post
    const post = await prisma.post.create({
      data: {
        userId: authResult.userId,
        caption,
        videoUrl,
        thumbnailUrl,
        duration,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            isVerified: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Post created successfully',
        data: post,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to create post' },
      { status: 500 }
    );
  }
}

