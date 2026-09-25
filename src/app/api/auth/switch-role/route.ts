import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DEMO_USERS } from '@/lib/mock-data';
import { ActiveRole } from '@/types';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { targetRole } = body as { targetRole: ActiveRole };

    if (!targetRole || (targetRole !== 'CLIENT' && targetRole !== 'FREELANCER')) {
      return NextResponse.json(
        { error: 'Invalid target role. Must be CLIENT or FREELANCER.' },
        { status: 400 }
      );
    }

    const userId = (session?.user as unknown as { id: string })?.id || 'user-dual-1';

    try {
      await prisma.user.update({
        where: { id: userId },
        data: { activeRole: targetRole },
      });
    } catch {
      // Sync in demo memory store
      const demoUser = DEMO_USERS.find((u) => u.id === userId);
      if (demoUser) {
        demoUser.activeRole = targetRole;
      }
    }

    return NextResponse.json({
      success: true,
      activeRole: targetRole,
      message: `Switched active perspective to ${targetRole} mode`,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { error: error.message || 'Failed to switch role' },
      { status: 500 }
    );
  }
}
