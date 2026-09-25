import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { INITIAL_PROPOSALS, DEMO_USERS, INITIAL_JOBS } from '@/lib/mock-data';
import { Proposal } from '@/types';

const localProposals: Proposal[] = [...INITIAL_PROPOSALS];

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const proposals = await prisma.proposal.findMany({
      where: { jobId: id },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            title: true,
            hourlyRate: true,
            rating: true,
            reviewCount: true,
            totalEarnings: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (proposals && proposals.length > 0) {
      return NextResponse.json(proposals);
    }
  } catch {
    // Memory fallback
  }

  const jobProposals = localProposals.filter((p) => p.jobId === id);
  return NextResponse.json(jobProposals);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id: jobId } = params;

  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { bidAmount, coverLetter, estimatedDuration } = body;

    if (!bidAmount || !coverLetter || !estimatedDuration) {
      return NextResponse.json(
        { error: 'Missing required proposal fields (bidAmount, coverLetter, estimatedDuration)' },
        { status: 400 }
      );
    }

    const freelancerId = (session?.user as unknown as { id: string })?.id || DEMO_USERS[1].id;
    const freelancerUser = DEMO_USERS.find((u) => u.id === freelancerId) || DEMO_USERS[1];

    try {
      // 1. Verify job exists
      const targetJob = await prisma.job.findUnique({ where: { id: jobId } });
      if (!targetJob) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }

      // 2. Prevent duplicate proposal
      const existing = await prisma.proposal.findUnique({
        where: {
          jobId_freelancerId: {
            jobId,
            freelancerId,
          },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'You have already submitted a proposal for this job.' },
          { status: 409 }
        );
      }

      // 3. Create proposal
      const newProposal = await prisma.proposal.create({
        data: {
          jobId,
          freelancerId,
          bidAmount: parseFloat(bidAmount),
          coverLetter,
          estimatedDuration,
          status: 'PENDING',
        },
        include: {
          freelancer: true,
        },
      });

      // 4. Create notification for the client
      await prisma.notification.create({
        data: {
          userId: targetJob.clientId,
          type: 'PROPOSAL_RECEIVED',
          title: 'New proposal received',
          message: `${freelancerUser.name} submitted a bid of $${bidAmount} on "${targetJob.title}"`,
          link: `/jobs/${jobId}`,
        },
      });

      return NextResponse.json(newProposal, { status: 201 });
    } catch {
      // Memory fallback
      const duplicate = localProposals.find((p) => p.jobId === jobId && p.freelancerId === freelancerId);
      if (duplicate) {
        return NextResponse.json(
          { error: 'You have already submitted a proposal for this job.' },
          { status: 409 }
        );
      }

      const createdProposal: Proposal = {
        id: `proposal-${Date.now()}`,
        jobId,
        freelancerId,
        bidAmount: parseFloat(bidAmount),
        coverLetter,
        estimatedDuration,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        freelancer: freelancerUser,
      };

      localProposals.unshift(createdProposal);

      // Increment proposal count on job
      const j = INITIAL_JOBS.find((item) => item.id === jobId);
      if (j && j._count) {
        j._count.proposals += 1;
      }

      return NextResponse.json(createdProposal, { status: 201 });
    }
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { error: error.message || 'Failed to submit proposal' },
      { status: 500 }
    );
  }
}
