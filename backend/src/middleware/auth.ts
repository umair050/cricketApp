import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export interface AuthRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
  };
}

export const authMiddleware = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'No token provided' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  // Verify user still exists and is active
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, isActive: true },
  });

  if (!user || !user.isActive) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'User not found or inactive' },
      { status: 401 }
    );
  }

  return payload;
};

