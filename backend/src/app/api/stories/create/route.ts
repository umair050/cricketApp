import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/middleware/auth';

const createStorySchema = z.object({
  mediaUrl: z.string().url('Invalid media URL'),
  mediaType: z.enum(['image', 'video']),
  thumbnailUrl: z.string().url().optional(),
  caption: z.string().max(200).optional(),
  duration: z.number().optional(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const authResult = await authMiddleware(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = await request.json();
    
    // Validate input
    const validation = createStorySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { mediaUrl, mediaType, thumbnailUrl, caption, duration, backgroundColor, textColor } = validation.data;

    // Calculate expiration time (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Create story
    const story = await prisma.story.create({
      data: {
        userId: authResult.userId,
        mediaUrl,
        mediaType,
        thumbnailUrl,
        caption,
        duration,
        backgroundColor,
        textColor,
        expiresAt,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Story created successfully',
        data: story,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create story error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to create story' },
      { status: 500 }
    );
  }
}

