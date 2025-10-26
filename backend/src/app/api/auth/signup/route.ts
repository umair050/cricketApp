import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { signupSchema } from '@/dto/auth.dto';
import { validateRequest } from '@/utils/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input using DTO
    const validation = validateRequest(signupSchema, body);
    if (!validation.success) {
      return validation.response;
    }

    const { username, firstName, lastName, email, phoneNumber, dateOfBirth, country, password } =
      validation.data;

    // Check if email already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'Email already exists', message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Check if username already exists
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { error: 'Username already exists', message: 'This username is already taken' },
        { status: 409 }
      );
    }

    // Check if phone number already exists
    const existingUserByPhone = await prisma.user.findFirst({
      where: { phoneNumber },
    });

    if (existingUserByPhone) {
      return NextResponse.json(
        { error: 'Phone number already exists', message: 'An account with this phone number already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        dateOfBirth: new Date(dateOfBirth),
        country,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        data: {
          user,
          token,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to create account' },
      { status: 500 }
    );
  }
}
