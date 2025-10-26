import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const verifyCodeSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = verifyCodeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { code } = validation.data;

    // Find reset code
    const resetCode = await prisma.passwordReset.findUnique({
      where: { code },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!resetCode) {
      return NextResponse.json(
        { error: 'Invalid code', message: 'The code you entered is invalid' },
        { status: 400 }
      );
    }

    if (resetCode.isUsed) {
      return NextResponse.json(
        { error: 'Code already used', message: 'This code has already been used' },
        { status: 400 }
      );
    }

    if (new Date() > resetCode.expiresAt) {
      return NextResponse.json(
        { error: 'Code expired', message: 'This code has expired' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Code verified successfully',
      data: {
        resetId: resetCode.id,
        userId: resetCode.userId,
      },
    });
  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to verify code' },
      { status: 500 }
    );
  }
}

