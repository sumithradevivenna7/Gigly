import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_JOBS, INITIAL_PROPOSALS, DEMO_USERS } from '@/lib/mock-data';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            companyName: true,
            companyDescription: true,
            rating: true,
            reviewCount: true,
            totalSpent: true,
            createdAt: true,
          },
        },
        proposals: {
          include: {
            freelancer: {
              select: {
                id: true,
                name: true,
                avatar: true,
                title: true,
                rating: true,
                reviewCount: true,
                hourlyRate: true,
                totalEarnings: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        contract: true,
      },
    });

    if (job) {
      return NextResponse.json(job);
    }
  } catch {
    // Fall back to memory
  }

  // Memory fallback
  const mockJob = INITIAL_JOBS.find((j) => j.id === id);
  if (!mockJob) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  const proposalsForJob = INITIAL_PROPOSALS.filter((p) => p.jobId === id);
  const clientUser = DEMO_USERS.find((u) => u.id === mockJob.clientId) || DEMO_USERS[0];

  return NextResponse.json({
    ...mockJob,
    client: clientUser,
    proposals: proposalsForJob,
  });
}
