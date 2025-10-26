import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/middleware/auth';

// GET suggested users to follow
export async function GET(request: NextRequest) {
  try {
    const authResult = await authMiddleware(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get users the current user is already following
    const following = await prisma.follow.findMany({
      where: { followerId: authResult.userId },
      select: { followingId: true },
    });

    const followingIds = following.map(f => f.followingId);

    // Get all users except self
    const allUsers = await prisma.user.findMany({
      where: {
        id: {
          not: authResult.userId,
        },
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        bio: true,
        occupation: true,
        isVerified: true,
        _count: {
          select: {
            followers: true,
            posts: true,
          },
        },
      },
      take: limit * 2, // Get more to filter and sort
      orderBy: {
        followers: {
          _count: 'desc',
        },
      },
    });

    // Add isFollowing flag to each user
    const usersWithFollowStatus = allUsers.map(user => ({
      ...user,
      isFollowing: followingIds.includes(user.id),
    }));

    // Sort: not following first, then by follower count
    const sortedUsers = usersWithFollowStatus.sort((a, b) => {
      if (!a.isFollowing && b.isFollowing) return -1;
      if (a.isFollowing && !b.isFollowing) return 1;
      return b._count.followers - a._count.followers;
    });

    return NextResponse.json({
      success: true,
      data: sortedUsers.slice(0, limit),
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

