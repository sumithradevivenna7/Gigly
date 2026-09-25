import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { DEMO_USERS } from '@/lib/mock-data';
import { UserRole, ActiveRole } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role, title, companyName } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields (name, email, password, role)' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(password, 10);
    const activeRole: ActiveRole = role === 'CLIENT' ? 'CLIENT' : 'FREELANCER';

    // Check if user exists in Prisma
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }

      // Create new user in PostgreSQL
      const newUser = await prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          passwordHash: hashedPassword,
          role: role as UserRole,
          activeRole: activeRole,
          title: title || (role === 'CLIENT' ? null : 'Freelance Specialist'),
          companyName: companyName || (role === 'CLIENT' ? `${name}'s Company` : null),
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        },
      });

      return NextResponse.json(
        {
          message: 'Account created successfully',
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            activeRole: newUser.activeRole,
          },
        },
        { status: 201 }
      );
    } catch {
      // In-memory registration fallback if local Postgres is not yet spun up
      const existsInDemo = DEMO_USERS.some((u) => u.email.toLowerCase() === normalizedEmail);
      if (existsInDemo) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }

      const mockId = `user-reg-${Date.now()}`;
      const mockCreatedUser = {
        id: mockId,
        email: normalizedEmail,
        name,
        role: role as UserRole,
        activeRole: activeRole,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        title: title || (role === 'CLIENT' ? null : 'Freelance Specialist'),
        companyName: companyName || (role === 'CLIENT' ? `${name}'s Company` : null),
        totalEarnings: 0,
        totalSpent: 0,
        rating: 5.0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
      };

      DEMO_USERS.push(mockCreatedUser);

      return NextResponse.json(
        {
          message: 'Account created successfully (local session)',
          user: {
            id: mockCreatedUser.id,
            name: mockCreatedUser.name,
            email: mockCreatedUser.email,
            role: mockCreatedUser.role,
            activeRole: mockCreatedUser.activeRole,
          },
        },
        { status: 201 }
      );
    }
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
