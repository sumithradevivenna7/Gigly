import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { INITIAL_CONTRACTS, DEMO_USERS } from '@/lib/mock-data';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as unknown as { id: string })?.id || DEMO_USERS[0].id;

    try {
      const contracts = await prisma.contract.findMany({
        where: {
          OR: [{ clientId: userId }, { freelancerId: userId }],
        },
        include: {
          job: true,
          proposal: true,
          client: {
            select: { id: true, name: true, avatar: true, companyName: true },
          },
          freelancer: {
            select: { id: true, name: true, avatar: true, title: true, rating: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (contracts && contracts.length > 0) {
        return NextResponse.json(contracts);
      }
    } catch {
      // Memory fallback
    }

    return NextResponse.json(INITIAL_CONTRACTS);
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
