import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';

const resetPasswordSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { code, newPassword } = validation.data;

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

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password and mark code as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetCode.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordReset.update({
        where: { id: resetCode.id },
        data: { isUsed: true },
      }),
    ]);

    // Generate token for auto-login
    const token = generateToken({
      userId: resetCode.user.id,
      email: resetCode.user.email,
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
      data: {
        token,
      },
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to reset password' },
      { status: 500 }
    );
  }
}

