import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/middleware/auth';

// GET all active stories from users you follow + your own stories
export async function GET(request: NextRequest) {
  try {
    const authResult = await authMiddleware(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const now = new Date();

    // Get list of users the current user follows
    const following = await prisma.follow.findMany({
      where: { followerId: authResult.userId },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);
    
    // Include current user's ID to get their own stories
    const userIds = [authResult.userId, ...followingIds];

    // Get all active stories (not expired) from followed users and self
    const stories = await prisma.story.findMany({
      where: {
        userId: { in: userIds },
        isActive: true,
        expiresAt: { gt: now },
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
        storyViews: {
          where: {
            userId: authResult.userId,
          },
          select: {
            id: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            storyViews: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Group stories by user
    const storiesByUser = stories.reduce((acc: any, story) => {
      const userId = story.userId;
      if (!acc[userId]) {
        acc[userId] = {
          user: story.user,
          stories: [],
          hasUnviewed: false,
        };
      }
      
      const isViewed = story.storyViews.length > 0;
      acc[userId].stories.push({
        ...story,
        isViewed,
      });
      
      if (!isViewed) {
        acc[userId].hasUnviewed = true;
      }
      
      return acc;
    }, {});

    // Convert to array and sort (unviewed first, then by latest story)
    const groupedStories = Object.values(storiesByUser).sort((a: any, b: any) => {
      // Current user's stories always first
      if (a.user.id === authResult.userId) return -1;
      if (b.user.id === authResult.userId) return 1;
      
      // Then sort by unviewed status
      if (a.hasUnviewed && !b.hasUnviewed) return -1;
      if (!a.hasUnviewed && b.hasUnviewed) return 1;
      
      // Finally sort by latest story
      const aLatest = Math.max(...a.stories.map((s: any) => new Date(s.createdAt).getTime()));
      const bLatest = Math.max(...b.stories.map((s: any) => new Date(s.createdAt).getTime()));
      return bLatest - aLatest;
    });

    return NextResponse.json({
      success: true,
      data: groupedStories,
    });
  } catch (error) {
    console.error('Get stories error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

