import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { findUserByEmail, addUser } from '@/lib/user-store';
import { UserRole, ActiveRole } from '@/types';

// CORS response helper
function corsResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role, title, companyName } = body;

    if (!name || !email || !password || !role) {
      return corsResponse(
        { error: 'Missing required fields: name, email, password, and role are required.' },
        400
      );
    }

    if (password.length < 6) {
      return corsResponse(
        { error: 'Password must be at least 6 characters long.' },
        400
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(password, 10);
    const activeRole: ActiveRole = role === 'CLIENT' ? 'CLIENT' : 'FREELANCER';

    // 1. Check if user already exists in in-memory store
    const existingStored = findUserByEmail(normalizedEmail);
    if (existingStored) {
      return corsResponse(
        { error: 'An account with this email address already exists.' },
        409
      );
    }

    // 2. Try PostgreSQL creation via Prisma if available
    let dbCreated = false;
    let userId = `user-${Date.now()}`;

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existingUser) {
        return corsResponse(
          { error: 'An account with this email address already exists.' },
          409
        );
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          passwordHash: hashedPassword,
          role: role as UserRole,
          activeRole,
          title: title || (role === 'CLIENT' ? null : 'Freelance Specialist'),
          companyName: companyName || (role === 'CLIENT' ? `${name}'s Company` : null),
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        },
      });

      userId = newUser.id;
      dbCreated = true;
    } catch {
      // Prisma DB not configured or unreachable -> gracefully continue with user-store
    }

    // 3. Always register in persistent in-memory user-store
    const createdUser = addUser({
      id: userId,
      email: normalizedEmail,
      name,
      passwordHash: hashedPassword,
      role: role as UserRole,
      activeRole,
      title: title || (role === 'CLIENT' ? null : 'Freelance Specialist'),
      companyName: companyName || (role === 'CLIENT' ? `${name}'s Company` : null),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      totalEarnings: 0,
      totalSpent: 0,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    });

    return corsResponse(
      {
        message: 'Account registered successfully',
        user: {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
          role: createdUser.role,
          activeRole: createdUser.activeRole,
        },
      },
      201
    );
  } catch (err: unknown) {
    const error = err as Error;
    return corsResponse(
      { error: error.message || 'Internal server error during registration' },
      500
    );
  }
}
