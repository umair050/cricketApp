import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/middleware/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { storyId: string } }
) {
  try {
    const authResult = await authMiddleware(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { storyId } = params;

    // Check if story exists and is active
    const story = await prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    if (!story.isActive || story.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Story is no longer available' },
        { status: 410 }
      );
    }

    // Don't count views from the story owner
    if (story.userId === authResult.userId) {
      return NextResponse.json({
        success: true,
        message: 'View not recorded for own story',
      });
    }

    // Create or update story view
    const storyView = await prisma.storyView.upsert({
      where: {
        storyId_userId: {
          storyId,
          userId: authResult.userId,
        },
      },
      update: {},
      create: {
        storyId,
        userId: authResult.userId,
      },
    });

    // Increment view count
    await prisma.story.update({
      where: { id: storyId },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Story view recorded',
      data: storyView,
    });
  } catch (error) {
    console.error('Record story view error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

